const creditsMapInputToken = {
  "gpt-4-turbo-preview": 0.1,
  "gpt-4": 0.3,
  "gpt-3.5-turbo": 0.005,
  "gpt-4-vision-preview": 200,
  "gemini-pro": 0.00125,
  "gemini-pro-vision": 25,
  "claude-2.1": 0.08,
  "claude-instant-1.2": 0.008,
  "claude-3-sonnet-20240229": 0.03,
  "claude-3-opus-20240229": 0.15
}

const creditsMapOutputToken = {
  "gpt-4-turbo-preview": 0.3,
  "gpt-4": 0.6,
  "gpt-3.5-turbo": 0.15,
  "gemini-pro": 0.00375,
  "claude-2.1": 0.24,
  "claude-instant-1.2": 0.024,
  "claude-3-sonnet-20240229": 0.15,
  "claude-3-opus-20240229": 0.75
}

export const CREDITS_PER_INPUT_TOKEN = creditsMapInputToken
export const CREDITS_PER_OUTPUT_TOKEN = creditsMapOutputToken
