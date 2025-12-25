import styled from "styled-components";
import { ReactNode } from "react";

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TabsHeader = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: ${(p) => (p.active ? "600" : "500")};
  color: ${(p) => (p.active ? "#1f2937" : "#6b7280")};
  background: ${(p) => (p.active ? "#f3f4f6" : "transparent")};
  border: none;
  border-bottom: 3px solid ${(p) => (p.active ? "#6366f1" : "transparent")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const TabContent = styled.div`
  padding: 20px;
`;

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <TabsContainer>
      <TabsHeader>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            type="button"
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabsHeader>
      <TabContent>
        {tabs.find((t) => t.id === activeTab)?.content}
      </TabContent>
    </TabsContainer>
  );
};
