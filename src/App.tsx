import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import { HomePage } from "./pages/HomePage"
import { CallForPapersPage } from "./pages/CallForPapersPage"
import { QualityPoliciesPage } from "./pages/QualityPoliciesPage"
import { SpecialSessionsPage } from "./pages/SpecialSessionsPage"
import { SpecialSessionDetailPage } from "./pages/SpecialSessionDetailPage"
import { WorkshopsPage } from "./pages/WorkshopsPage"
import { DoctoralSymposiumPage } from "./pages/DoctoralSymposiumPage"
import { WorkshopDetailPage } from "./pages/WorkshopDetailPage"
import { PublicationIndexingPage } from "./pages/PublicationIndexingPage"
import { PaperSubmissionPage } from "./pages/PaperSubmissionPage"
import { PaperRegistrationPage } from "./pages/PaperRegistrationPage"
import { ImportantDatesPage } from "./pages/ImportantDatesPage"
import { CommitteesPage } from "./pages/CommitteesPage"
import { KeynoteSpeakerPage } from "./pages/KeynoteSpeakerPage"
import { InvitedSpeakersPage } from "./pages/InvitedSpeakersPage"
import { JournalPublicationOpportunitiesPage } from "./pages/JournalPublicationOpportunitiesPage"
import { VenuePage } from "./pages/VenuePage"
import { VisaInformationPage } from "./pages/VisaInformationPage"
import { HotelStayPage } from "./pages/HotelStayPage"
import { NearbyAttractionsPage } from "./pages/NearbyAttractionsPage"
import { InternationalExcellenceImpactAwardsPage } from "./pages/InternationalExcellenceImpactAwardsPage"
import { ContactPage } from "./pages/ContactPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { siteConfig } from "./config/siteConfig"

export default function App() {
  return (
    <BrowserRouter basename={siteConfig.root}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="call-for-papers" element={<CallForPapersPage />} />
          <Route path="quality-policies" element={<QualityPoliciesPage />} />
          <Route path="special-sessions" element={<SpecialSessionsPage />} />
          <Route path="special-sessions/:slug" element={<SpecialSessionDetailPage />} />
          <Route path="workshops" element={<WorkshopsPage />} />
          <Route path="workshops/:slug" element={<WorkshopDetailPage />} />
          <Route
            path="doctoral-research-symposium"
            element={<DoctoralSymposiumPage />}
          />
          <Route path="publication-indexing" element={<PublicationIndexingPage />} />
          <Route path="paper-submission" element={<PaperSubmissionPage />} />
          <Route path="paper-registration" element={<PaperRegistrationPage />} />
          <Route path="important-dates" element={<ImportantDatesPage />} />
          <Route path="committees" element={<CommitteesPage />} />
          <Route path="keynote-speaker" element={<KeynoteSpeakerPage />} />
          <Route path="invited-speakers" element={<InvitedSpeakersPage />} />
          <Route
            path="journal-publication-opportunities"
            element={<JournalPublicationOpportunitiesPage />}
          />
          <Route path="venue" element={<VenuePage />} />
          <Route path="visa-information" element={<VisaInformationPage />} />
          <Route path="hotel-stay" element={<HotelStayPage />} />
          <Route path="nearby-attractions" element={<NearbyAttractionsPage />} />
          {siteConfig.awardsPublished ? (
            <Route
              path="awards/international-excellence-and-impact-awards"
              element={<InternationalExcellenceImpactAwardsPage />}
            />
          ) : null}
          <Route path="contact-us" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
