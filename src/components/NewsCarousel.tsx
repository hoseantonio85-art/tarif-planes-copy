import { ChevronRight, Landmark, Newspaper } from "lucide-react";

interface NewsCard {
  tag: string;
  tagType: "law" | "news";
  title: string;
  description: string;
}

const cards: NewsCard[] = [
  {
    tag: "Законодательство",
    tagType: "law",
    title: "Название закона",
    description:
      "Ужесточились требования к обработке персональных данных и существенно выросли штрафы за выявленные нарушения.",
  },
  {
    tag: "Новость",
    tagType: "news",
    title: "Название новости",
    description:
      "Невский районный суд Петербурга закрыл магазин-склад ООО 'Соки и воды' в Ростове-на-Дону по иску Роспотребнадзор...",
  },
  {
    tag: "Законодательство",
    tagType: "law",
    title: "Ужесточение требований к обработке персональных данных",
    description:
      "Ужесточились требования к обработке персональных данных и существенно выросли штрафы за выявленные нарушения.",
  },
];

const tagIcon = (type: "law" | "news") =>
  type === "law" ? <Landmark size={14} /> : <Newspaper size={14} />;

const NewsCarousel = () => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-foreground">
        Я собрал важные изменения в законах и СМИ
      </h2>
      <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        Смотреть все <ChevronRight size={16} />
      </button>
    </div>

    <div className="gradient-accent rounded-2xl p-4">
      <div className="grid grid-cols-3 gap-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-card rounded-xl p-4 flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-primary">{tagIcon(card.tagType)}</span>
                <span className="text-xs font-medium text-primary">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-primary mt-3 hover:opacity-80">
              Принять меры <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Carousel dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        <div className="w-6 h-1.5 rounded-full bg-muted-foreground/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
      </div>

      {/* Next arrow */}
      <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card shadow flex items-center justify-center hover:bg-muted hidden">
        <ChevronRight size={18} />
      </button>
    </div>
  </section>
);

export default NewsCarousel;
