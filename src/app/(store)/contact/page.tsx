import type { Metadata } from "next";

import { PageHeader } from "@/modules/store/ui/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/constants/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us – Get in Touch with ZERO | STICK",
  description:
    "Have questions about our stickers, shipping, or custom orders? Reach out to the ZERO | STICK team by email, phone, or visit us in Bangalore.",
  path: "/contact",
});

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
]);

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact ZERO | STICK",
  url: `${SITE_CONFIG.url}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    email: SITE_CONFIG.contact.email,
    telephone: SITE_CONFIG.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.contact.streetAddress,
      addressLocality: SITE_CONFIG.contact.addressLocality,
      addressRegion: SITE_CONFIG.contact.addressRegion,
      postalCode: SITE_CONFIG.contact.postalCode,
      addressCountry: SITE_CONFIG.country,
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd id="contact-breadcrumbs" data={breadcrumbs} />
      <JsonLd id="contact-page" data={contactPageJsonLd} />
      <PageHeader 
        title="Contact Us" 
        description="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you have a question about our products, shipping, or custom orders, our team is ready to help.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="hover-lift">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">Generic support email</p>
                    <a href="mailto:support@stickerstore.com" className="text-primary hover:underline mt-1 block">
                      support@stickerstore.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-sm text-muted-foreground">Mon-Fri from 9am to 6pm.</p>
                    <a href="tel:+919876543210" className="text-primary hover:underline mt-1 block">
                      +91 98765 43210
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Sticker Street<br />
                      Koramangala, 4th Block<br />
                      Bangalore, KA 560034
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your inquiry..." 
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button className="w-full" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
