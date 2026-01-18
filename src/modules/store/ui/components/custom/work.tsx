import { motion } from "framer-motion";
import { Upload, Scissors, Truck } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload & Adjust",
      description:
        "Upload your artwork and customize the shape, size, and material. Preview your sticker in real-time.",
    },
    {
      number: "02",
      icon: Scissors,
      title: "We Print & Cut",
      description:
        "Our precision machines print your design on premium vinyl and die-cut it to perfection.",
    },
    {
      number: "03",
      icon: Truck,
      title: "Shipped to You",
      description:
        "Your custom stickers are carefully packaged and shipped straight to your doorstep.",
    },
  ];

  return (
    <section id="how-it-works" className="section-dark py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            How It <span className="text-muted-foreground">Works</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            From your screen to your hands in just 3 simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-linear-to-r from-white/20 to-transparent z-0" />
              )}

              <div className="relative z-10 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors h-full flex flex-col">
                <div className="text-8xl font-bold text-white/5 absolute -top-4 -left-2 select-none">
                  {step.number}
                </div>

                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/60 leading-relaxed grow">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}