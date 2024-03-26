CREATE OR REPLACE FUNCTION update_token_count_and_log()
RETURNS TRIGGER AS $$

DECLARE
  token_cost NUMERIC;
  prev_credits_left NUMERIC;
BEGIN
  -- Retrieve the previous token count for logging
  SELECT credits_left INTO prev_credits_left FROM profiles WHERE user_id = NEW.user_id;

  -- Determine token cost based on model, user role, and content length
  IF NEW.role = 'user' AND NEW.model LIKE '%vision%' THEN
    SELECT INTO token_cost CASE NEW.model
      WHEN 'gpt-4-vision-preview' THEN 200
      WHEN 'gemini-pro-vision' THEN 25
      -- Add specific mappings for vision models here
      ELSE 0
    END;
  ELSIF NEW.role = 'user' THEN
    SELECT INTO token_cost CASE NEW.model
      WHEN 'gpt-4-turbo-preview' THEN 0.1
      WHEN 'gpt-4' THEN 0.3
      WHEN 'gpt-3.5-turbo' THEN 0.005
      WHEN 'gemini-pro' THEN 0.00125
      WHEN 'claude-2.1' THEN 0.08
      WHEN 'claude-instant-1.2' THEN 0.008
      WHEN 'claude-3-sonnet-20240229' THEN 0.03
      WHEN 'claude-3-opus-20240229' THEN 0.15
      -- Add the rest of your mapping here for input tokens
      ELSE 0
    END * (LENGTH(NEW.content)/4);
  ELSE
    SELECT INTO token_cost CASE NEW.model
      WHEN 'gpt-4-turbo-preview' THEN 0.3
      WHEN 'gpt-4' THEN 0.6
      WHEN 'gpt-3.5-turbo' THEN 0.15
      WHEN 'gemini-pro' THEN 0.00375
      WHEN 'claude-2.1' THEN 0.24
      WHEN 'claude-instant-1.2' THEN 0.024
      WHEN 'claude-3-sonnet-20240229' THEN 0.15
      WHEN 'claude-3-opus-20240229' THEN 0.75
      -- Add the rest of your mapping here for output tokens
      ELSE 0
    END * (LENGTH(NEW.content)/4);
  END IF;

  -- Update the user's token count
  UPDATE profiles SET credits_left = prev_credits_left - token_cost
  WHERE id = NEW.user_id;

  -- Log the token consumption
  INSERT INTO tokens_log (assistant_id, chat_id, created_at, file_id, message_id, new_token, prev_token, tokens_consumed, tool_id, user_id)
  VALUES (NULL, NEW.chat_id, CURRENT_TIMESTAMP, NULL, NEW.id, (prev_credits_left - token_cost), prev_credits_left, token_cost, NULL, NEW.user_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;