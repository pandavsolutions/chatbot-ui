CREATE TRIGGER update_token_and_log_after_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_token_count_and_log();-