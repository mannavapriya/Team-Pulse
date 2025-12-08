import { Injectable } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class InsightsService {
  private openai: OpenAI;

  constructor(
    private updatesService: UpdatesService,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateInsights(): Promise<string> {
    const todayUpdates = await this.updatesService.findTodayTeam();
    if (todayUpdates.length === 0) return 'No updates submitted today.';

    const updatesText = todayUpdates
      .map(
        (u) =>
          `• ${u.userId}\n  - Tasks: ${u.tasks}\n  - Blockers: ${
            u.blockers || 'None'
          }\n  - Help Indicator: ${u.priority || 'N/A'}\n  - Mood: ${
            u.mood || 'N/A'
          }`
      )
      .join('\n\n');

    const prompt = `
You are an expert AI team assistant.
Analyze the following daily standup updates from this team and produce a **structured, actionable report**.
Follow this below Help Indicator Guide:
Need Help (1) – Needs help with tasks.
Working on It (2) – Working on it, may reach out if needed.
All Good (3) – All good, nothing to worry.Please note that this is the only development team in the company and focus on team-wide insights.

Include:
1. Analyzis of overall team progress and productivity
2. Steps to resolve the blockers
3. Recommendations for action items and improvements
4. Mood analysis and team engagement patterns
5. Potential collaboration or handoff opportunities

Return output in numbered and bullet-point format, concise but actionable.

Updates:
${updatesText}
`;

    // USE THE NEW RESPONSES API
    const response = await this.openai.responses.create({
      model: 'gpt-4.1',
      input: prompt,
      max_output_tokens: 800,
      temperature: 0.6
    });

    return response.output_text || 'No insights generated.';
  }
}
