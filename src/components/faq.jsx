export function FAQ() {
  const faqs = [
    {
      question: "Is this really free?",
      answer: "Yes, our core library of culinary techniques is open-source and free for all home chefs."
    },
    {
      question: "Can I contribute my own recipes?",
      answer: "Absolutely! We encourage community contributions. Check our GitHub repo to see how to submit a pull request."
    },
    {
      question: "Is there a mobile app?",
      answer: "We are currently web-first, but our site is fully responsive and optimized for mobile browsers."
    },
    {
      question: "Do I need professional gear?",
      answer: "Not at all. Our recipes are designed for standard home kitchens."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-24">
      <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
      
      {/* 2-column grid on desktop, 1-column on mobile */}
      <div className="grid gap-8 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <div key={index} className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              {faq.question}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}