(() => {
   
    try {
        document.querySelector(".headerMenu")?.remove();
        document.querySelector("app-ai-agent-root")?.remove();
        document.querySelector(".feedback.aem-GridColumn")?.remove();
        document.querySelector(".breadcrumb.aem-GridColumn")?.remove(); 
    
      } catch (e) {
        // noop
      }
  })();