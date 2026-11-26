import { cn } from "cn";

const defaultProps = {
  heading: "О магазине",
  sections: [
    {
      title: "Качество",
      content: "Каждое растение проходит контроль перед отправкой клиенту.",
    },
    {
      title: "Забота",
      content:
        "Бережно и надежно упаковываем в защитную коробку с фиксацией корневой системы.",
    },
    {
      title: "Поддержка",
      content: `Нужна консультация перед покупкой или помощь после получения?
          Дадим подробные инструкции, если у вас возникнут вопросы.`,
    },
    {
      title: "Качество, забота, поддержка",
    },
  ],
};

const MAX_COLUMNS = 3;
const COLUMN_CHARS = 160;

const truncate = (content) => {
  if (content.length <= COLUMN_CHARS) {
    return content;
  }
  return `${content.slice(0, COLUMN_CHARS).trimEnd()}…`;
};

export const AboutScreen = (props) => {
  const { heading, sections, className } = {
    ...defaultProps,
    ...props,
  };

  const columns = (sections ?? []).slice(0, MAX_COLUMNS);
  const valuesTitle = sections?.[3]?.title;
  const valuesBody = sections?.[3]?.content;

  return (
    <section className={cn("w-full py-6 md:py-10", className)}>
      <div className="w-full">
        <div className="flex flex-col gap-16 lg:gap-24">
          <div className="flex flex-col gap-4 lg:gap-8">
            <h2 className="max-w-4xl text-4xl font-semibold tracking-tighter lg:text-7xl">
              {heading}
            </h2>

            <p className="w-full text-lg sm:text-xl leading-relaxed text-muted-foreground">
              Здравствуйте, дорогие друзья и ценители прекрасного! Меня зовут
              Сузопова Елена Анатольевна. И если вы сейчас читаете эти строки,
              значит, вам тоже знакомо то самое чувство, когда взгляд падает на
              горшок с новым листочком, а на душе становится теплее и спокойнее.
              Позвольте поделиться моей историей. Я не просто продавец, я —
              продолжатель семейного дела. Всё началось в 2005 году, когда моя
              мама, заразив меня своим энтузиазмом, начала разводить растения
              «для души». Тогда это была пара горшков на подоконнике, но в
              каждом уже жила огромная любовь к земле, корням и зелени.
              Постепенно мой дом и сад превратились в настоящий оазис, а «хобби
              для души» переросло в «дело для жизни». Почему я это делаю? Я
              считаю, что растения — это не просто «товар». Это молчаливые
              друзья, которые умеют слушать, очищают воздух и наполняют дом
              уютом без ремонта. И самое приятное для вас, как для читателя (и
              будущего обладателя зелёного питомца): Я искренне хочу, чтобы ваши
              растения не просто выживали, а цвели, пахли и радовали вас долгие
              годы. Поэтому с каждым заказом или при покупке в нашей лавке вы
              получаете бесплатную консультацию по уходу. Честно, без заумных
              терминов, на пальцах. Моя миссия — сделать так, чтобы этот мир
              стал чуть зеленее, а вы — чуть счастливее. Приходите ко мне за
              растениями, уходите с новыми друзьями! С теплом и любовью к
              листочкам, Сузопова Елена Анатольевна 🌿
            </p>
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex max-w-4xl flex-col gap-4">
              {valuesTitle && (
                <h3 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  {valuesTitle}
                </h3>
              )}
              {valuesBody && (
                <p className="text-lg text-muted-foreground">{valuesBody}</p>
              )}
            </div>
            <div className="grid gap-10 md:grid-cols-3 md:gap-12">
              {columns.map((section) => (
                <div
                  key={section.title}
                  className="flex flex-col gap-3 border-t border-border pt-6"
                >
                  <h4 className="text-lg font-semibold">{section.title}</h4>
                  <p className="text-muted-foreground">
                    {truncate(section.content)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
