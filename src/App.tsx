/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { InboxView } from './components/InboxView';
import { CampaignsView } from './components/CampaignsView';
import { DeliverablesView } from './components/DeliverablesView';
import { FilesView } from './components/FilesView';
import { PrioritiesView } from './components/PrioritiesView';
import { ActivityView } from './components/ActivityView';
import { SettingsView } from './components/SettingsView';
import { AssistantDrawer } from './components/AssistantDrawer';
import { DeliverModal } from './components/DeliverModal';
import { GmailModal } from './components/GmailModal';
import { LoginPage } from './components/LoginPage';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useWorkspace();
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [gmailModalOpen, setGmailModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex flex-col md:flex-row text-[#171A18] antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView onOpenDeliverModal={() => setDeliverModalOpen(true)} />
          )}

          {activeTab === 'inbox' && (
            <InboxView onOpenGmailModal={() => setGmailModalOpen(true)} />
          )}

          {activeTab === 'campaigns' && <CampaignsView />}

          {activeTab === 'deliverables' && <DeliverablesView />}

          {activeTab === 'files' && <FilesView />}

          {activeTab === 'priorities' && <PrioritiesView />}

          {activeTab === 'activity' && <ActivityView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* AI Assistant Persistent Slide-over */}
      <AssistantDrawer />

      {/* Modals */}
      <DeliverModal
        isOpen={deliverModalOpen}
        onClose={() => setDeliverModalOpen(false)}
      />

      <GmailModal
        isOpen={gmailModalOpen}
        onClose={() => setGmailModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
