import React, { useState } from "react";
import TopToolbar from "./ide/TopToolbar";
import LeftSidebar from "./ide/LeftSidebar";
import Editor from "./ide/Editor";
import RightSidebar from "./ide/RightSidebar";
import BottomPanel from "./ide/BottomPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

interface HomeProps {
  defaultLeftSidebarCollapsed?: boolean;
  defaultRightSidebarOpen?: boolean;
  defaultBottomPanelOpen?: boolean;
}

export default function Home({
  defaultLeftSidebarCollapsed = false,
  defaultRightSidebarOpen = true,
  defaultBottomPanelOpen = true,
}: HomeProps) {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(
    defaultLeftSidebarCollapsed,
  );
  const [rightSidebarOpen, setRightSidebarOpen] = useState(
    defaultRightSidebarOpen,
  );
  const [bottomPanelOpen, setBottomPanelOpen] = useState(
    defaultBottomPanelOpen,
  );
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <TopToolbar />

      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            minSize={10}
            maxSize={30}
            collapsible
            collapsedSize={4}
            collapsed={leftSidebarCollapsed}
          >
            <LeftSidebar
              isCollapsed={leftSidebarCollapsed}
              onToggleCollapse={() =>
                setLeftSidebarCollapsed(!leftSidebarCollapsed)
              }
            />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={60}>
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <Editor
                  isFullscreen={isEditorFullscreen}
                  onToggleFullscreen={() =>
                    setIsEditorFullscreen(!isEditorFullscreen)
                  }
                />
              </div>
              {bottomPanelOpen && (
                <BottomPanel
                  isOpen={bottomPanelOpen}
                  onClose={() => setBottomPanelOpen(false)}
                />
              )}
            </div>
          </ResizablePanel>

          {rightSidebarOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
                <RightSidebar
                  isOpen={rightSidebarOpen}
                  onClose={() => setRightSidebarOpen(false)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
