import type { Metadata } from "next";

import { PageHeader } from "@/modules/store/ui/components/page-header";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read the ZERO | STICK privacy policy to learn how we collect, use, and protect your personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader 
        title="Privacy Policy" 
        description="We care about your privacy. Read about how we collect, use, and share your personal information."
      />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary animate-fade-up" style={{ animationDelay: "0.2s" }}>
          
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: January 01, 2026
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
              We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Collecting and Using Your Personal Data</h2>
            <h3 className="text-xl font-semibold mb-3">Types of Data Collected</h3>
            <h4 className="text-lg font-semibold mb-2">Personal Data</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Usage Data</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Use of Your Personal Data</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Company may use Personal Data for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
              <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
              <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
              <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Retention of Your Personal Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Security of Your Personal Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Changes to this Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
              We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
