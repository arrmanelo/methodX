-- DATABASE_SETUP.sql
-- Инструкции по настройке базы данных для новых функций MethodX
-- Выполните эти SQL команды в Supabase SQL Editor

-- ================================================
-- 1. ТАБЛИЦА НПА (Нормативно-правовые акты)
-- ================================================

CREATE TABLE IF NOT EXISTS npa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  document_number TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('law', 'regulation', 'order', 'instruction', 'letter', 'other')),
  approval_date DATE NOT NULL,
  file_url TEXT,
  external_link TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_npa_category ON npa(category);
CREATE INDEX IF NOT EXISTS idx_npa_document_type ON npa(document_type);
CREATE INDEX IF NOT EXISTS idx_npa_approval_date ON npa(approval_date DESC);

-- RLS (Row Level Security) - все могут читать
ALTER TABLE npa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "NPA публичны для чтения" ON npa
  FOR SELECT USING (true);

CREATE POLICY "Только админы могут управлять НПА" ON npa
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );

-- ================================================
-- 2. ТАБЛИЦА ГОСО (Государственные образовательные стандарты)
-- ================================================

CREATE TABLE IF NOT EXISTS goso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  document_number TEXT NOT NULL,
  approval_date DATE NOT NULL,
  file_url TEXT,
  external_link TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_goso_subject ON goso(subject);
CREATE INDEX IF NOT EXISTS idx_goso_grade_level ON goso(grade_level);

-- RLS
ALTER TABLE goso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ГОСО публичны для чтения" ON goso
  FOR SELECT USING (true);

CREATE POLICY "Только админы могут управлять ГОСО" ON goso
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );

-- ================================================
-- 3. ТАБЛИЦА ТИПОВЫХ ПРАВИЛ
-- ================================================

CREATE TABLE IF NOT EXISTS typical_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  approval_date DATE NOT NULL,
  file_url TEXT,
  external_link TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE typical_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Типовые правила публичны для чтения" ON typical_rules
  FOR SELECT USING (true);

CREATE POLICY "Только админы могут управлять типовыми правилами" ON typical_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );

-- ================================================
-- 4. ТАБЛИЦА ВОПРОСОВ И ОТВЕТОВ (Q&A)
-- ================================================

CREATE TABLE IF NOT EXISTS qa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_approved BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_qa_category ON qa(category);
CREATE INDEX IF NOT EXISTS idx_qa_author ON qa(author_id);
CREATE INDEX IF NOT EXISTS idx_qa_approved ON qa(is_approved);

-- RLS
ALTER TABLE qa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Q&A публичны для чтения" ON qa
  FOR SELECT USING (true);

CREATE POLICY "Авторизованные пользователи могут создавать вопросы" ON qa
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Авторы могут редактировать свои вопросы" ON qa
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Авторы могут удалять свои вопросы" ON qa
  FOR DELETE USING (author_id = auth.uid());

-- ================================================
-- 5. ТАБЛИЦА FAQ
-- ================================================

CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  order_number INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_order ON faq(order_number);

-- RLS
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQ публичны для чтения" ON faq
  FOR SELECT USING (true);

CREATE POLICY "Только админы могут управлять FAQ" ON faq
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );

-- ================================================
-- 6. ТАБЛИЦА ИНКЛЮЗИВНОГО ОБРАЗОВАНИЯ
-- ================================================

CREATE TABLE IF NOT EXISTS inclusive_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'guide', 'methodology', 'case_study', 'video', 'other')),
  disability_type TEXT[],
  grade_level TEXT,
  subject TEXT,
  file_url TEXT,
  video_url TEXT,
  external_link TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_inclusive_resource_type ON inclusive_education(resource_type);
CREATE INDEX IF NOT EXISTS idx_inclusive_author ON inclusive_education(author_id);

-- RLS
ALTER TABLE inclusive_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Материалы по инклюзии публичны для чтения" ON inclusive_education
  FOR SELECT USING (true);

CREATE POLICY "Учителя могут создавать материалы по инклюзии" ON inclusive_education
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.id = auth.uid()
      AND user_roles.role = 'teacher'
    )
  );

CREATE POLICY "Авторы могут редактировать свои материалы" ON inclusive_education
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Авторы могут удалять свои материалы" ON inclusive_education
  FOR DELETE USING (author_id = auth.uid());

-- ================================================
-- 7. ТАБЛИЦА КАТЕГОРИЙ
-- ================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  order_number INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_number);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Категории публичны для чтения" ON categories
  FOR SELECT USING (true);

-- ================================================
-- 8. STORAGE BUCKETS (Хранилище файлов)
-- ================================================

-- Создайте bucket для документов в Supabase Storage Dashboard:
-- Имя: documents
-- Public: true

-- Политики для storage bucket 'documents':
-- SELECT на storage.objects для публичного доступа
-- INSERT для авторизованных пользователей
-- UPDATE/DELETE для владельцев файлов

-- ================================================
-- 9. ПРИМЕРЫ ДАННЫХ (опционально)
-- ================================================

-- Пример НПА
INSERT INTO npa (title, description, document_number, document_type, approval_date, category, tags)
VALUES (
  'Закон РК "Об образовании"',
  'Основной закон, регулирующий образовательную деятельность в Республике Казахстан',
  'от 27 июля 2007 года № 319-III',
  'law',
  '2007-07-27',
  'Законодательство',
  ARRAY['образование', 'законодательство', 'основной закон']
);

-- Пример ГОСО
INSERT INTO goso (title, description, subject, grade_level, document_number, approval_date)
VALUES (
  'ГОСО начального образования',
  'Государственный общеобязательный стандарт начального образования',
  'Математика',
  '1-4 классы',
  'Приказ МОН РК от 31.10.2018 № 604',
  '2018-10-31'
);

-- Пример FAQ
INSERT INTO faq (question, answer, category, order_number)
VALUES (
  'Как зарегистрироваться на платформе?',
  'Нажмите кнопку "Регистрация" в верхнем меню, заполните форму с указанием email, пароля и выберите роль (учитель или студент).',
  'registration',
  1
);

-- ================================================
-- 10. ФУНКЦИИ ДЛЯ АВТОМАТИЧЕСКОГО ОБНОВЛЕНИЯ updated_at
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем триггер к таблицам
CREATE TRIGGER update_npa_updated_at BEFORE UPDATE ON npa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goso_updated_at BEFORE UPDATE ON goso
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_typical_rules_updated_at BEFORE UPDATE ON typical_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qa_updated_at BEFORE UPDATE ON qa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON faq
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inclusive_education_updated_at BEFORE UPDATE ON inclusive_education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ГОТОВО!
-- ================================================

-- После выполнения этих команд:
-- 1. Создайте storage bucket 'documents' в Supabase Dashboard
-- 2. Настройте публичный доступ для bucket
-- 3. Добавьте свои данные через админ-панель
-- 4. Наслаждайтесь новыми функциями!
