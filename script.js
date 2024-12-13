
document.getElementById("generateBtn").addEventListener("click", async function () {
    const topic = document.getElementById("topicInput").value.trim();
    const articleContent = document.getElementById("articleContent");
    const downloadBtn = document.getElementById("downloadPDF");

    if (!topic) {
        articleContent.innerHTML = "<p style='color: red;'>يرجى إدخال عنوان الموضوع.</p>";
        return;
    }

    articleContent.innerHTML = "<p>جارٍ توليد المقال... يرجى الانتظار.</p>";
    downloadBtn.style.display = "none";

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: `اكتب مقالًا طويلًا ومفصلًا عن الموضوع التالي: ${topic}. يجب أن يكون المقال غنيًا بالمعلومات.`,
                max_tokens: 1500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        const generatedText = data.choices[0].text.trim();

        articleContent.innerHTML = `<p>${generatedText}</p>`;
        downloadBtn.style.display = "block";

        // إعداد زر تحميل PDF
        downloadBtn.addEventListener("click", function () {
            const blob = new Blob([generatedText], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${topic}.pdf`;
            a.click();
        });
    } catch (error) {
        console.error("خطأ أثناء توليد المقال:", error);
        articleContent.innerHTML = "<p style='color: red;'>حدث خطأ أثناء توليد المقال.</p>";
    }
});
