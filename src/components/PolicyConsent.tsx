import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, AlertTriangle, CheckCircle2, X, ArrowRight } from "lucide-react";

interface PolicyConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

function resolveStaffSignInMode(): "disabled" | "staff-only" | "all" {
  try {
    const enabled = localStorage.getItem("yz-staff-sign-in-enabled") === "true";
    if (!enabled) return "disabled";
  } catch {
    return "disabled";
  }

  try {
    const action = localStorage.getItem("yz-staff-sign-in-action");
    if (action === "accept") {
      return "staff-only";
    }
  } catch {
    // Storage unavailable — fall through to the default.
  }

  return "all";
}

const policies = [
  {
    id: "terms",
    title: "Terms & Conditions",
    icon: FileText,
    content: `TERMS & CONDITIONS — YASIR ZAYED

Last Updated: August 31, 2026

1. ACCEPTANCE OF TERMS
By accessing or using any services provided by Yasir Zayed Business Development & Consultancy ("the Firm," "we," "us," or "our"), including our website, digital platforms, consulting services, security solutions, technology services and all associated offerings, you ("the Client," "you," or "your") agree to be bound by these Terms and Conditions in their entirety. If you do not agree, you must not use our services.

2. SERVICES PROVIDED
The Firm provides business development consulting, sales and marketing strategy, promotional services, security technology solutions, web and application development, AI system integration, workflow automation, company registration and advisory services. All services are subject to availability and the Firm's sole discretion regarding acceptance of engagements.

3. NO FREE CONSULTATIONS
All consultations, advisory sessions, strategy meetings, assessments, evaluations, diagnostic reviews, preliminary discussions and任何形式 of professional guidance provided by the Firm are strictly paid services. No consultation — whether conducted in person, via telephone, video conference, email, chat or any other medium — is provided free of charge unless explicitly stated in a signed written agreement. Any initial discussions do not constitute a free consultation and may incur charges at the Firm's standard hourly or session rates.

4. CLIENT OBLIGATIONS
a) You shall provide accurate, complete and timely information necessary for the Firm to deliver its services.
b) You shall designate authorized representatives with authority to make decisions on your behalf.
c) You shall respond to information requests within agreed timeframes to avoid project delays.
d) You shall not use the Firm's services for any illegal, fraudulent or unethical purpose.

5. INTELLECTUAL PROPERTY
All strategies, frameworks, methodologies, templates, reports, presentations, software, code and proprietary materials developed by the Firm remain the intellectual property of the Firm unless explicitly transferred under a separate written agreement. The Client receives a limited, non-exclusive license to use deliverables for internal business purposes.

6. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of proprietary information shared during the engagement. This obligation survives the termination of the agreement for a period of not less than five (5) years.

7. LIMITATION OF LIABILITY
a) The Firm shall not be liable for any indirect, incidental, consequential, special or punitive damages arising from or related to the services provided, including but not limited to loss of profits, revenue, data, business opportunities or goodwill.
b) The Firm's total aggregate liability for any claim arising from or related to the services shall not exceed the total fees paid by the Client to the Firm for the specific service giving rise to the claim during the twelve (12) months immediately preceding the event.
c) The Firm makes no guarantees regarding specific outcomes, results, revenue increases, market share gains or any other business metric. All projections, forecasts and estimates provided are advisory in nature and based on assumptions that may not materialize.
d) The Client acknowledges that business development, market conditions and competitive landscapes are inherently uncertain, and past performance of the Firm's strategies for other clients does not guarantee similar results.

8. INDEMNIFICATION
The Client agrees to indemnify, defend and hold harmless the Firm, its directors, employees, contractors and agents from and against any and all claims, damages, losses, liabilities, costs and expenses (including reasonable legal fees) arising from the Client's use of the services, breach of these Terms or violation of any applicable law.

9. DISPUTE RESOLUTION
Any dispute arising from or related to these Terms or the services shall be resolved through good faith negotiation first, then mediation, and if necessary, binding arbitration in Nairobi, Kenya, under the rules of the Nairobi Centre for International Arbitration. The prevailing party shall be entitled to recover reasonable legal fees and costs.

10. GOVERNING LAW
These Terms are governed by the laws of the Republic of Kenya. Any legal proceedings shall be conducted in the courts of Nairobi, Kenya.

11. MODIFICATIONS
The Firm reserves the right to modify these Terms at any time. Continued use of the services following any modifications constitutes acceptance of the revised Terms.

12. SEVERABILITY
If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: Shield,
    content: `PRIVACY POLICY — YASIR ZAYED

Last Updated: August 31, 2026

1. INFORMATION WE COLLECT
We may collect and process the following categories of personal data:
a) Identity Data: Name, title, username, photograph, position, company affiliation.
b) Contact Data: Email addresses, telephone numbers, postal addresses, social media profiles.
c) Financial Data: Payment information, billing addresses, transaction records.
d) Technical Data: IP addresses, browser type and version, operating system, device identifiers, usage data.
e) Business Data: Company information, industry, employee count, revenue range, business objectives.
f) Communication Data: Correspondence records, meeting notes, feedback, survey responses.

2. HOW WE USE YOUR INFORMATION
Your personal data is processed for the following purposes:
a) To deliver and improve our consulting, technology and security services.
b) To communicate with you regarding engagements, proposals, invoices and updates.
c) To manage your account, verify your identity and process payments.
d) To comply with legal obligations and enforce our contractual rights.
e) To send marketing communications (only with your explicit consent).
f) To conduct analytics, research and business intelligence.
g) To protect the security of our systems and prevent fraud.

3. DATA SHARING
We may share your data with:
a) Service providers and technology partners who assist in service delivery (under strict data processing agreements).
b) Legal and regulatory authorities when required by law.
c) Professional advisors including lawyers, auditors and insurers.
d) Business partners involved in joint service delivery (with your knowledge).
We do not sell, rent or trade your personal data to third parties for their marketing purposes.

4. DATA SECURITY
We implement industry-standard technical and organizational measures to protect your data, including encryption, access controls, secure storage, regular audits and employee training. However, no method of transmission over the Internet is 100% secure.

5. DATA RETENTION
We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law. Typically, business engagement data is retained for seven (7) years after the conclusion of the engagement.

6. YOUR RIGHTS
Under applicable data protection laws, you have the right to:
a) Access the personal data we hold about you.
b) Request correction of inaccurate data.
c) Request deletion of your data (subject to legal retention requirements).
d) Object to or restrict processing of your data.
e) Request portability of your data.
f) Withdraw consent for marketing communications at any time.

7. COOKIES AND TRACKING
Our website uses essential cookies for core functionality. Analytics and marketing cookies are only used with your explicit consent. You may manage your cookie preferences at any time using our cookie settings panel.

8. INTERNATIONAL TRANSFERS
Where your data is transferred outside of Kenya, we ensure appropriate safeguards are in place, including standard contractual clauses where required by law.

9. CONTACT
For privacy-related inquiries, contact our Data Protection Officer at privacy@yasirzayed.com.`,
  },
  {
    id: "consultancy",
    title: "Consultancy Policy",
    icon: AlertTriangle,
    content: `CONSULTANCY POLICY — YASIR ZAYED

Last Updated: August 31, 2026

1. NATURE OF CONSULTING SERVICES
Yasir Zayed Business Development & Consultancy provides professional advisory, strategy, technology and security services. All engagements are based on the Firm's professional expertise, industry knowledge and best practices. The Firm acts as a consultant and advisor — not as a fiduciary, guarantor or insurer of outcomes.

2. NO GUARANTEE OF RESULTS
The Client expressly acknowledges and agrees that:
a) The Firm does not guarantee any specific business outcomes, financial results, revenue targets, market share gains, cost reductions or any other measurable performance indicators as a result of its advisory services.
b) Business success depends on numerous factors beyond the control of any consultant, including market conditions, competitive dynamics, execution capability, economic factors and unforeseen events.
c) Recommendations and strategies provided are advisory in nature and represent the Firm's professional opinion based on available information at the time of delivery.
d) The Client retains full responsibility for implementing, monitoring and adapting any recommendations provided by the Firm.

3. ADVISORY DELAYS
a) The Firm will make reasonable efforts to deliver services within agreed timelines. However, specific advisory outcomes, recommendations or deliverables may be delayed due to factors including but not limited to: incomplete or delayed information from the Client, changes in scope, market complexity, third-party dependencies or force majeure events.
b) The Firm shall not be liable for any business losses, missed opportunities, financial damages or adverse consequences resulting from advisory delays, regardless of the cause.
c) The Client agrees that delays in receiving advisory recommendations do not constitute grounds for claims against the Firm unless such delays are caused by gross negligence or willful misconduct by the Firm, and even then, liability is strictly limited as set forth in Section 5 below.

4. LIMITATION OF FIRM LIABILITY
a) The Firm shall not be liable for any direct, indirect, incidental, consequential, special, punitive or exemplary damages arising from or related to its consulting services, including but not limited to: loss of revenue, loss of profit, loss of business, loss of data, loss of goodwill, business interruption, or any other pecuniary or non-pecuniary loss.
b) The Firm's total aggregate liability for any and all claims arising from or related to any single engagement shall not exceed the total fees actually paid by the Client to the Firm for that specific engagement.
c) This limitation of liability applies regardless of the legal theory (contract, tort, negligence, strict liability or otherwise) and regardless of whether the Firm has been advised of the possibility of such damages.
d) The Client waives the right to pursue any claim exceeding the liability cap set forth above.

5. CLIENT ACKNOWLEDGMENTS
The Client acknowledges and agrees that:
a) The Firm's role is advisory. Implementation and execution of recommendations is the Client's sole responsibility.
b) No advisory opinion, recommendation or deliverable constitutes a legal, financial, investment or medical opinion.
c) The Client should seek independent professional advice (legal, financial, tax, medical) as appropriate before acting on any recommendation.
d) The Firm may recommend third-party products, services or partners. The Firm is not responsible for the performance, quality or reliability of any third-party offering.

6. CLIENT RESPONSIBILITIES
a) The Client shall provide timely, accurate and complete information as requested by the Firm.
b) The Client shall designate a primary contact with authority to make decisions.
c) The Client shall implement recommendations in a timely manner and notify the Firm of any material changes.
d) The Client acknowledges that failure to fulfill its responsibilities may impact service quality and results.

7. INDEPENDENT INSURANCE REQUIREMENT
a) The Client is strongly advised and expected to maintain adequate professional indemnity insurance, general business liability insurance and any other insurance coverage appropriate for its industry and operations.
b) The Client shall maintain sufficient insurance to cover any potential losses, damages or claims that may arise from the Client's business operations, implementation of the Firm's recommendations or any third-party actions.
c) The Client shall not rely on the Firm's services or any recommendation as a substitute for proper insurance coverage.
d) In the event that the Client suffers losses, the Client's primary recourse shall be against its own insurance policies, not against the Firm.
e) The Firm maintains its own professional indemnity insurance, but such coverage does not extend to the Client's operations or business decisions.

8. FORCE MAJEURE
The Firm shall not be liable for any failure or delay in performance caused by circumstances beyond its reasonable control, including but not limited to: acts of God, natural disasters, pandemics, government actions, war, terrorism, civil unrest, power failures, internet outages, cyber-attacks or supply chain disruptions.

9. INDEPENDENT CONTRACTOR
The Firm is an independent contractor and nothing in this agreement creates a partnership, joint venture, agency or employment relationship between the Firm and the Client.

10. TERMINATION
Either party may terminate an engagement with thirty (30) days' written notice. The Client shall pay for all services rendered up to the date of termination. Termination does not relieve the Client of obligations regarding confidentiality, intellectual property and indemnification.

11. GOVERNING LAW
This policy is governed by the laws of the Republic of Kenya. Any disputes shall be resolved in the courts of Nairobi, Kenya.

12. ENTIRE AGREEMENT
This Consultancy Policy, together with the Terms & Conditions and Privacy Policy, constitutes the entire agreement between the parties regarding the subject matter herein and supersedes all prior discussions and agreements.`,
  },
];

export default function PolicyConsent({ onAccept, onDecline }: PolicyConsentProps) {
  const [activePolicy, setActivePolicy] = useState(0);
  const [scrolledToEnd, setScrolledToEnd] = useState<Record<string, boolean>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToConsultancy, setAgreedToConsultancy] = useState(false);

  const [staffSignInAcknowledged, setStaffSignInAcknowledged] = useState<"pending" | "accepted" | "declined">(
    "pending",
  );
  const staffSignInMode = resolveStaffSignInMode();
  void staffSignInMode;
  void staffSignInAcknowledged;
  void setStaffSignInAcknowledged;

  const handleScroll = (policyId: string, e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 30;
    if (isAtBottom) {
      setScrolledToEnd((prev) => ({ ...prev, [policyId]: true }));
    }
  };
  const allAgreed = agreedToTerms && agreedToPrivacy && agreedToConsultancy;



  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl max-h-[90vh] bg-card rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Review & Accept Policies
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Please review each policy below before creating your account.
              </p>
            </div>
            <button
              onClick={onDecline}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Policy tabs */}
        <div className="flex border-b border-border shrink-0">
          {policies.map((policy, i) => {
            const Icon = policy.icon;
            return (
              <button
                key={policy.id}
                onClick={() => setActivePolicy(i)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all border-b-2 ${
                  activePolicy === i
                    ? "text-electric border-electric bg-electric/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{policy.title}</span>
                {scrolledToEnd[policy.id] && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Policy content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={policies[activePolicy].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <div
                className="h-[300px] overflow-y-auto p-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono text-[11px]"
                onScroll={(e) => handleScroll(policies[activePolicy].id, e)}
              >
                {policies[activePolicy].content}
                {scrolledToEnd[policies[activePolicy].id] && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-xs font-semibold">
                    ✓ You have reviewed this policy in full
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Checkboxes */}
        <div className="p-6 border-t border-border space-y-3 shrink-0 bg-muted/30">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border text-electric focus:ring-electric"
            />
            <span className="text-sm text-foreground">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={() => setActivePolicy(0)}
                className="text-electric font-medium hover:underline"
              >
                Terms & Conditions
              </button>
              , including that <strong>no consultation is free</strong> and the Firm's{" "}
              <strong>liability limitations</strong>.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border text-electric focus:ring-electric"
            />
            <span className="text-sm text-foreground">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={() => setActivePolicy(1)}
                className="text-electric font-medium hover:underline"
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedToConsultancy}
              onChange={(e) => setAgreedToConsultancy(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border text-electric focus:ring-electric"
            />
            <span className="text-sm text-foreground">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={() => setActivePolicy(2)}
                className="text-electric font-medium hover:underline"
              >
                Consultancy Policy
              </button>
              , including the{" "}
              <strong>independent insurance requirement</strong> and acknowledgement that
              the Firm shall not be liable unless otherwise agreed via contract.
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex items-center justify-between shrink-0">
          <button
            onClick={onDecline}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            Decline & Exit
          </button>
          <button
            onClick={onAccept}
            disabled={!allAgreed}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold transition-all ${
              allAgreed
                ? "bg-electric text-white hover:bg-electric-dark shadow-lg shadow-electric/20"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Accept All & Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
