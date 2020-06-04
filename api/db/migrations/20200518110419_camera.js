const addIndex = `
CREATE OR REPLACE FUNCTION vn_unaccent(text)
  RETURNS text AS
$func$
SELECT lower(translate($1,
'¹²³ÀÁẢẠÂẤẦẨẬẪÃÄÅÆàáảạâấầẩẫậãäåæĀāĂẮẰẲẴẶăắằẳẵặĄąÇçĆćĈĉĊċČčĎďĐđÈÉẸÊẾỀỄỆËèéẹêềếễệëĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨÌÍỈỊÎÏìíỉịîïĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłÑñŃńŅņŇňŉŊŋÒÓỎỌÔỐỒỔỖỘỐỒỔỖỘƠỚỜỞỠỢÕÖòóỏọôốồổỗộơớờỡợởõöŌōŎŏŐőŒœØøŔŕŖŗŘřßŚśŜŝŞşŠšŢţŤťŦŧÙÚỦỤƯỪỨỬỮỰÛÜùúủụûưứừửữựüŨũŪūŬŭŮůŰűŲųŴŵÝýÿŶŷŸŹźŻżŽžёЁ',
'123AAAAAAAAAAAAAAaaaaaaaaaaaaaaAaAAAAAAaaaaaaAaCcCcCcCcCcDdDdEEEEEEEEEeeeeeeeeeEeEeEeEeEeGgGgGgGgHhHhIIIIIIIiiiiiiiIiIiIiIiIiJjKkkLlLlLlLlLlNnNnNnNnnNnOOOOOOOOOOOOOOOOOOOOOOOooooooooooooooooooOoOoOoEeOoRrRrRrSSsSsSsSsTtTtTtUUUUUUUUUUUUuuuuuuuuuuuuUuUuUuUuUuUuWwYyyYyYZzZzZzеЕ'));
$func$ LANGUAGE sql IMMUTABLE;

ALTER TABLE public.camera ADD "fts" tsvector;

CREATE FUNCTION my_trigger_function()
RETURNS trigger AS $$
BEGIN NEW.fts = 
  setweight(to_tsvector(coalesce(vn_unaccent(NEW.code))), 'A') ||
	setweight(to_tsvector(coalesce(vn_unaccent(NEW.fulltext))), 'B');
  RETURN NEW;
END $$ LANGUAGE 'plpgsql';

CREATE TRIGGER my_trigger
BEFORE INSERT OR UPDATE ON public.camera
FOR EACH ROW
EXECUTE PROCEDURE my_trigger_function();

CREATE INDEX idx_fts ON public.camera USING gin(fts);
`;

const removeIndex = `
  DROP FUNCTION IF EXISTS my_trigger_function();
`;

exports.up = async function (knex) {
  await knex.schema.createTable('camera', (t) => {
    t.increments('id');
    t.string('name');

    t.string('fulltext');

    t.integer('dvrconfig_id').unsigned();
    t.foreign('dvrconfig_id')
      .references('id')
      .inTable('dvrconfig')
      .onDelete('restrict')
      .onUpdate('restrict');

    t.integer('location_id').unsigned();
    t.foreign('location_id')
      .references('id')
      .inTable('location')
      .onDelete('restrict')
      .onUpdate('restrict');
  });
  await knex.schema.raw(addIndex);
  return;
};

exports.down = async function (knex) {
  await knex.schema.dropTable('camera');
  await knex.schema.raw(removeIndex);
  return;
};
