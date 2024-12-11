import { Plugin, Notice, WorkspaceLeaf } from "obsidian";

export default class IframeReloaderPlugin extends Plugin {
  async onload() {
    console.log("Iframe Reloader Plugin loaded");

    // 리본 아이콘 추가
    this.addRibbonIcon("refresh-cw", "Reload iframe", () => {
      this.reloadIframe();
    });

    // 명령어 추가
    this.addCommand({
      id: "reload-iframe",
      name: "Reload iframe in the current note",
      callback: () => this.reloadIframe(),
    });
  }

  reloadIframe() {
    const leaf: WorkspaceLeaf = this.app.workspace.activeLeaf;

    if (!leaf) {
      new Notice("No active note found.");
      return;
    }

    // 현재 노트에서 모든 iframe 요소 가져오기
    const iframes = document.querySelectorAll("iframe");

    if (iframes.length === 0) {
      new Notice("No iframe found in the current note.");
      return;
    }

    if (iframes.length === 1) {
      // iframe이 하나만 있는 경우 즉시 리로드
      const iframe = iframes[0];
      const src = iframe.getAttribute("src");
      if (src) {
        iframe.setAttribute("src", src); // 리로드
        new Notice("Iframe reloaded successfully.");
      } else {
        new Notice("Iframe found but no src attribute present.");
      }
      return;
    }

    // iframe이 여러 개인 경우 사용자에게 선택 목록 표시
    const options = Array.from(iframes).map((iframe, index) => {
      const src = iframe.getAttribute("src") || "No src";
      return `${index + 1}: ${src}`;
    });

    // 사용자에게 프롬프트로 선택을 요청
    const userChoice = prompt(
      `Select an iframe to reload:\n\n${options.join("\n")}\n\nEnter the number (1-${iframes.length}):`
    );

    if (!userChoice) {
      new Notice("Iframe reload canceled.");
      return;
    }

    const selectedIndex = parseInt(userChoice, 10) - 1;

    // 입력값이 유효한지 확인
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= iframes.length) {
      new Notice("Invalid selection. Please enter a valid number.");
      return;
    }

    // 선택된 iframe 리프레시
    const selectedIframe = iframes[selectedIndex];
    const selectedSrc = selectedIframe.getAttribute("src");
    if (selectedSrc) {
      selectedIframe.setAttribute("src", selectedSrc); // 리로드
      new Notice(`Iframe ${selectedIndex + 1} reloaded successfully.`);
    } else {
      new Notice(`Iframe ${selectedIndex + 1} has no src attribute.`);
    }
  }

  onunload() {
    console.log("Iframe Reloader Plugin unloaded");
  }
}
