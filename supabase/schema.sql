-- Bảng thẻ bài
CREATE TABLE cards (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('truth', 'dare', 'do')),
  content     TEXT NOT NULL,
  spicy_level TEXT NOT NULL CHECK (spicy_level IN ('chill', 'spicy', 'wild')),
  punishment  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cards are publicly readable" ON cards FOR SELECT USING (true);

-- Bảng lịch sử game
CREATE TABLE game_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode         TEXT NOT NULL CHECK (mode IN ('classic', 'chaos')),
  spicy_level  TEXT NOT NULL CHECK (spicy_level IN ('chill', 'spicy', 'wild')),
  players      JSONB NOT NULL,
  total_rounds INT NOT NULL,
  played_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert history" ON game_history FOR INSERT WITH CHECK (true);
