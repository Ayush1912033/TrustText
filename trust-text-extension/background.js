// Creates the context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkSpam",
    title: "Check with Trust Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "checkSpam") {
        const selectedText = info.selectionText;

        try {
            const response = await fetch('http://127.0.0.1:5000/classify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: selectedText })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            // Pass the result directly to the injected function
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: showPopup,
                args: [result] // Pass the result as an argument
            });

        } catch (err) {
            console.error('Error fetching data or executing script:', err);
        }
    }
});

// The injected function now accepts an argument
// The injected function now accepts an argument
// The injected function now accepts an argument
function showPopup(classificationResult) {
    const existingPopup = document.getElementById('trust-text-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 'trust-text-popup';
    
    // Updated styling to ensure visibility and add scrollbar
    popup.style.position = 'fixed';
    popup.style.bottom = '10px';
    popup.style.right = '10px';
    popup.style.backgroundColor = '#f9f9f9';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '8px';
    popup.style.padding = '15px';
    popup.style.zIndex = '9999';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.color = '#333';
    popup.style.maxWidth = '300px';
    popup.style.minWidth = '200px';
    popup.style.maxHeight = '80vh'; // New: Limits height to 80% of viewport
    popup.style.overflowY = 'auto'; // New: Adds a vertical scrollbar if content exceeds max-height
    
    // Create inner content with a canvas element
    let innerContent;
    if (classificationResult) {
        const confidence = classificationResult.confidence || 0;
        const spamWords = classificationResult.spamWords ? classificationResult.spamWords.join(', ') : 'None';

       innerContent = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 1.1em;">Trust Text Spam Analysis</strong>
                <button id="trust-text-close-button" style="
                    background: none;
                    border: none;
                    font-size: 1.2em;
                    cursor: pointer;
                    color: #555;
                    padding: 0;
                    line-height: 1;
                ">&times;</button>
            </div>
            <p style="margin: 5px 0;"><strong>Result:</strong> ${classificationResult.result}</p>
            
            <div style="text-align: center; margin: 10px 0;">
                <canvas id="confidenceGauge" width="150" height="100"></canvas>
            </div>
            
            <p style="margin: 5px 0; **word-wrap: break-word; overflow-wrap: break-word;**"><strong>Spam Words:</strong> ${spamWords}</p>
        `;
    } else {
        innerContent = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 1.1em;">Trust Text Spam Analysis</strong>
                <button id="trust-text-close-button" style="
                    background: none;
                    border: none;
                    font-size: 1.2em;
                    cursor: pointer;
                    color: #555;
                    padding: 0;
                    line-height: 1;
                ">&times;</button>
            </div>
            <p>Error: Classification result not provided.</p>
        `;
    }
    
    popup.innerHTML = innerContent;
    document.body.appendChild(popup);

    // Get a reference to the canvas and close button after appending the popup
    const closeButton = document.getElementById('trust-text-close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            popup.remove();
        });
    }
    
    // Gauge Chart Drawing Logic
    // Gauge Chart Drawing Logic
    const gaugeCanvas = document.getElementById('confidenceGauge');
    if (gaugeCanvas && classificationResult) {
        const ctx = gaugeCanvas.getContext('2d');
        const confidence = classificationResult.confidence || 0;
        const normalizedConfidence = Math.min(Math.max(confidence, 0), 100);

        // --- Corrected variables for proper alignment ---
        const centerX = gaugeCanvas.width / 2;
        const centerY = gaugeCanvas.height * 0.9; // Adjusted: Moves center up to 90% of the canvas height
        const radius = gaugeCanvas.height * 0.6;
        const lineWidth = 15;
        const startAngle = Math.PI; // 180 degrees
        const endAngle = Math.PI * 2; // 360 degrees

        // Determine color based on confidence
        let gaugeColor;
        if (normalizedConfidence > 80) {
            gaugeColor = '#4caf50'; // Green for high confidence
        } else if (normalizedConfidence > 50) {
            gaugeColor = '#ffc107'; // Yellow for medium confidence
        } else {
            gaugeColor = '#f44336'; // Red for low confidence
        }

        // Draw the background arc (the full grey gauge)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#e0e0e0';
        ctx.stroke();

        // Draw the filled arc (based on confidence)
        const confidenceAngle = startAngle + (normalizedConfidence / 100) * Math.PI;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, confidenceAngle);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = gaugeColor;
        ctx.stroke();

        // Draw the text
        ctx.font = '20px Arial';
        ctx.fillStyle = gaugeColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${normalizedConfidence.toFixed(0)}%`, centerX, centerY - (radius / 2)); // Adjusted: Centers text vertically
    }
}