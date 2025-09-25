import { ESLint } from 'eslint';
import { readFileSync } from 'fs';
import { join } from 'path';
import { format } from 'prettier';

export interface TsTemplateVariables {
  [key: string]: string;
}

export class TsTemplateProcessor {
  private templatesDir: string;
  private eslint: ESLint;

  constructor(templatesDir: string) {
    this.templatesDir = templatesDir;
    this.eslint = new ESLint({ fix: true });
  }

  /**
   * Process a template file with the given variables
   */
  protected async processTemplate(templateName: string, variables: TsTemplateVariables): Promise<string> {
    // Read the template file
    const templatePath = join(this.templatesDir, `${templateName}.ts.template`);
    let content = readFileSync(templatePath, 'utf-8');

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value);
    });

    // Format with Prettier
    content = await this.formatWithPrettier(content);

    // Apply ESLint fixes
    content = await this.formatWithEslint(content);

    return content;
  }

  /**
   * Format content with Prettier
   */
  private async formatWithPrettier(content: string): Promise<string> {
    try {
      return await format(content, {
        parser: 'typescript',
      });
    } catch (error) {
      console.warn('Prettier formatting failed:', error);
      return content;
    }
  }

  /**
   * Format content with ESLint
   */
  private async formatWithEslint(content: string): Promise<string> {
    try {
      const results = await this.eslint.lintText(content);

      return results[0].output || content;
    } catch (error) {
      console.warn('ESLint formatting failed:', error);
      return content;
    }
  }
}
