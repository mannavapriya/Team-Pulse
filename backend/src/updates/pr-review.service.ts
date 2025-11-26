// pr-review.service.ts
import { Injectable } from '@nestjs/common';
import { PRReviewDto } from './pr-review.dto';
import OpenAI from 'openai';
import axios from 'axios';

@Injectable()
export class PRReviewService {
  private openai: OpenAI;

  constructor() {
    // Use internal OpenAI API key from environment variable
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables.');
    }
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async reviewPR(dto: PRReviewDto) {
    // 1. Fetch PR files from GitHub
    const url = `https://api.github.com/repos/${dto.repoOwner}/${dto.repoName}/pulls/${dto.prNumber}/files`;
    const headers = { Authorization: `token ${process.env.GITHUB_PAT}` };
    const { data: files } = await axios.get(url, { headers });

    const fileReviews: { filename: string; review: any }[] = [];

    for (const file of files) {
      if (!file.patch) continue;

      // Only added lines
      const addedLines = file.patch
        .split('\n')
        .filter(line => line.startsWith('+') && !line.startsWith('+++ '))
        .map(line => line.substring(1))
        .join('\n');

      if (!addedLines.trim()) continue;

      // 2. Call OpenAI for review
      const prompt = `
        You are an expert code reviewer. Evaluate the following code:
        - Correctness (logical errors/bugs)
        - Readability (clear and maintainable)
        - Efficiency (loops/memory)
        - Best practices (style, naming, conventions)

        Provide a score 1-5 for each, actionable feedback, and a short summary.
        Respond strictly as JSON.

        Code:
        ${addedLines}
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 600,
      });

      const reviewText = completion.choices[0].message?.content || '{}';
      let reviewJson = {};
      try {
        reviewJson = JSON.parse(reviewText);
      } catch {
        reviewJson = { error: 'Failed to parse JSON from LLM output', raw: reviewText };
      }

      fileReviews.push({ filename: file.filename, review: reviewJson });
    }

    return { prNumber: dto.prNumber, files: fileReviews };
  }
}
