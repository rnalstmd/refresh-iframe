import { Plugin, Notice, Modal, Setting } from "obsidian";

export default class IframeReloaderPlugin extends Plugin {
  async onload() {
    console.log("Iframe Reloader Plugin loaded");

    // 리본 아이콘 추가
    this.addRibbonIcon("refresh-cw", "Reload iframe", () => {
      console.log("Ribbon button clicked!");
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
    console.log("Reloading iframes...");
    // 모든 iframe 요소 가져오기
    const iframes = document.querySelectorAll("iframe");
    console.log("Found iframes:", iframes);

    if (iframes.length === 0) {
      new Notice("No iframe found in the current note.");
      return;
    }

    if (iframes.length === 1) {
      // iframe이 하나일 경우 즉시 리로드
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

    // 여러 iframe이 있는 경우 Modal로 선택창 표시
    new IframeSelectorModal(this.app, iframes).open();
  }

  onunload() {
    console.log("Iframe Reloader Plugin unloaded");
  }
}

class IframeSelectorModal extends Modal {
  iframes: NodeListOf<HTMLIFrameElement>;

  constructor(app: any, iframes: NodeListOf<HTMLIFrameElement>) {
    super(app);
    this.iframes = iframes;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: "Select an iframe to reload" });

    // 각 iframe에 대해 버튼 추가
    this.iframes.forEach((iframe, index) => {
      const src = iframe.getAttribute("src") || "No src";
      new Setting(contentEl)
        .setName(`Iframe ${index + 1}`)
        .setDesc(src)
        .addButton((btn) =>
          btn
            .setButtonText("Reload")
            .onClick(() => {
              const src = iframe.getAttribute("src");
              if (src) {
                iframe.setAttribute("src", src);
                new Notice(`Iframe ${index + 1} reloaded successfully.`);
              } else {
                new Notice(`Iframe ${index + 1} has no src attribute.`);
              }
              this.close();
            })
        );
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
