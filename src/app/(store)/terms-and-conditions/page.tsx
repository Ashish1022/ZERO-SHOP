import { PageHeader } from "@/modules/store/ui/components/page-header";

export default function TermsPage() {
  return (
    <>
      <PageHeader 
        title="Terms and Conditions" 
        description="Please read these terms and conditions carefully before using our service."
      />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary animate-fade-up" style={{ animationDelay: "0.2s" }}>
          
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: January 01, 2026
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Interpretation and Definitions</h2>
            <h3 className="text-xl font-semibold mb-3">Interpretation</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>
            <h3 className="text-xl font-semibold mb-3">Definitions</h3>
            <p className="text-muted-foreground leading-relaxed">
              For the purposes of these Terms and Conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party.</li>
              <li><strong>Country</strong> refers to: Bangalore, India</li>
              <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to StickerStore.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
              <li><strong>Service</strong> refers to the Website.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Acknowledgment</h2>
            <p className="text-muted-foreground leading-relaxed">
              These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
              Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service and its original content (excluding Content provided by You or other users), features and functionality are and will remain the exclusive property of the Company and its licensors.
              The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Links to Other Websites</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
              The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
              Upon termination, Your right to use the Service will cease immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 INR if You haven't purchased anything through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms and Conditions, You can contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>By email: legal@stickerstore.com</li>
              <li>By visiting this page on our website: /contact</li>
            </ul>
          </section>

        </div>
      </div>
    </>
  );
}
