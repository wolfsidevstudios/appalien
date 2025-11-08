import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

const getMockResponse = (prompt: string): string => {
  const lowerCasePrompt = prompt.toLowerCase();
  if (lowerCasePrompt.includes("todo")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cosmic Todo App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .task-item:hover .remove-btn { opacity: 1; transform: scale(1); }
        .remove-btn { opacity: 0; transform: scale(0.8); transition: opacity 0.2s, transform 0.2s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }
    </style>
</head>
<body class="bg-[#111827] text-gray-100">
    <div class="container mx-auto max-w-lg p-4 sm:p-8">
        <div class="bg-[#1F2937]/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
            <div class="p-8">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    </div>
                    <h1 class="text-3xl font-bold text-white">Cosmic Tasks</h1>
                </div>

                <div class="flex gap-2 mb-6">
                    <input id="todo-input" type="text" class="bg-gray-800 text-white flex-grow p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-700" placeholder="Add a new mission...">
                    <button id="add-btn" class="bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-5 rounded-lg transition-transform transform hover:scale-105">Add</button>
                </div>
                <ul id="todo-list" class="space-y-3">
                </ul>
            </div>
        </div>
    </div>
    <script>
        const todoInput = document.getElementById('todo-input');
        const addBtn = document.getElementById('add-btn');
        const todoList = document.getElementById('todo-list');

        addBtn.addEventListener('click', () => {
            const taskText = todoInput.value.trim();
            if (taskText) {
                addTodoItem(taskText);
                todoInput.value = '';
            }
        });
        
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addBtn.click();
        });

        function addTodoItem(taskText) {
            const li = document.createElement('li');
            li.className = 'task-item flex justify-between items-center bg-gray-800/80 p-4 rounded-lg border border-gray-700 fade-in';
            
            const taskContent = document.createElement('div');
            taskContent.className = 'flex items-center gap-3';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600 cursor-pointer';
            checkbox.onchange = () => {
                span.classList.toggle('line-through');
                span.classList.toggle('text-gray-500');
            };

            const span = document.createElement('span');
            span.textContent = taskText;
            span.className = 'transition-colors';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
            deleteBtn.className = 'remove-btn text-gray-500 hover:text-red-500';
            deleteBtn.onclick = () => li.remove();
            
            taskContent.appendChild(checkbox);
            taskContent.appendChild(span);
            li.appendChild(taskContent);
            li.appendChild(deleteBtn);
            todoList.prepend(li);
        }
    </script>
</body>
</html>`;
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vibe Code Generated App</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white flex items-center justify-center h-screen">
    <div class="text-center p-4">
        <h1 class="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Prompt Received!</h1>
        <p class="text-xl text-gray-400">"${prompt}"</p>
        <p class="text-md text-gray-500 mt-4">This is a mock response. To use the real Gemini API, please provide your API key.</p>
    </div>
</body>
</html>`;
};

export const generateCode = async (prompt: string, existingCode: string, imageUrl: string | null): Promise<string> => {
  if (!API_KEY || API_KEY === 'TODO_YOUR_API_KEY_HERE') {
    console.warn("API_KEY not found. Using mock data. To use the real API, please set the API_KEY environment variable.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockResponse(prompt);
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const imagePromptSection = imageUrl
    ? `
**Visual Reference:**
Use the following image as a primary visual inspiration for the UI. Analyze its layout, color scheme, typography, and component styles. THIS IS THE MOST IMPORTANT INSTRUCTION.
Image URL: ${imageUrl}
`
    : '';

  const fullPrompt = `
You are "Vibe," a world-class senior frontend engineer and UI/UX designer AI. Your specialty is creating single-file, production-ready, and aesthetically stunning web applications that look like the examples provided to you. You will generate complete HTML, CSS, and JavaScript code based on a user's request.

You MUST follow these design and technical principles:

**1. Core Philosophy: Modern & Spacious**
- **Clarity First:** The interface must be intuitive and easy to use.
- **Aesthetic:** Create modern, clean, and uncluttered designs. Use generous whitespace to guide focus and create a sense of calm.
- **Engagement:** Incorporate subtle microinteractions and visual delights to make the experience enjoyable.

**2. Layout, Grid, and Spacing (CRITICAL)**
- **Foundation: 8-Point Grid System:** All spacing (margins, padding) and sizing must be in multiples of 8px (e.g., 8, 16, 24, 32, 48px). Use Tailwind's spacing scale which aligns with this (e.g., p-2=8px, p-4=16px, p-6=24px).
- **Structure:** Center content in a container with a max-width (e.g., \`max-w-xl\`, \`max-w-2xl\`) for readability on larger screens.
- **Card-Based Design:** Group related content into cards with rounded corners.

**3. Color System (Dark Mode First)**
- **Background:** Use a deep, near-black charcoal. Tailwind: \`bg-gray-950\` (\`#030712\`) or \`bg-slate-900\` (\`#0f172a\`).
- **Surface/Cards:** Use a slightly lighter dark gray for cards and surfaces. Tailwind: \`bg-gray-900\` (\`#111827\`) or \`bg-slate-800\` (\`#1e293b\`).
- **Borders:** Use subtle borders to separate elements. Tailwind: \`border-gray-800\` (\`#1f2937\`) or \`border-slate-700\` (\`#334155\`).
- **Text:**
    - Primary Text: Near-white. Tailwind: \`text-gray-100\` (\`#f3f4f6\`) or \`text-slate-200\` (\`#e2e8f0\`).
    - Secondary Text: A lighter gray for labels and descriptions. Tailwind: \`text-gray-400\` (\`#9ca3af\`) or \`text-slate-400\` (\`#94a3b8\`).
- **Accent Color:** Use vibrant colors for buttons, links, and highlights. Gradients are highly encouraged. Example: \`bg-gradient-to-r from-purple-500 to-cyan-400\`.

**4. Typography**
- **Font:** Use 'Inter' (already imported via Google Fonts).
- **Scale:** Establish a clear visual hierarchy.
    - H1: \`text-4xl\` or \`text-5xl\`, \`font-bold\`
    - Body: \`text-base\` or \`text-lg\`, \`text-gray-300\`
    - Labels: \`text-sm\`, \`font-medium\`, \`text-gray-400\`
- **Line Height:** Use relaxed line heights for readability (e.g., \`leading-relaxed\`).

**5. Component Styling**
- **Buttons:**
    - **Corner Radius:** \`rounded-lg\` (8px) or \`rounded-full\`.
    - **States:** Must have visually distinct hover states (e.g., \`hover:bg-opacity-80\`, \`hover:scale-105\`).
    - **Variants:** Primary CTAs should be solid or have a gradient. Secondary can be outlines or lighter fills.
- **Forms & Inputs:**
    - **Style:** Dark background (\`bg-gray-800\`), no default browser styles.
    - **Padding:** \`p-3\` or \`px-4 py-2\`.
    - **States:** On focus, show a colored ring or border. Tailwind: \`focus:ring-2 focus:ring-purple-500\`.
- **Cards:**
    - **Corner Radius:** \`rounded-xl\` (12px) or \`rounded-2xl\` (16px).
    - **Shadows:** Use soft, diffused shadows to create depth, e.g., \`shadow-lg\` or \`shadow-2xl\`.
    - **Border:** A subtle 1px border is often sufficient.

**Technical Constraints:**
1.  **Single File:** All code (HTML, CSS, JS) must be in one \`.html\` file.
2.  **Styling:** Use Tailwind CSS from \`<script src="https://cdn.tailwindcss.com"></script>\`. Use \`<style>\` tags for custom CSS like animations.
3.  **JavaScript:** All JavaScript must be inside \`<script>\` tags in the \`<body>\`.
4.  **Iteration:** You will be given the user's prompt and the existing code. Modify and improve the existing code to meet the new prompt. If the prompt is a brand new idea, you can start from scratch.

---
${imagePromptSection}

**User Prompt:**
"${prompt}"

**Existing Code:**
\`\`\`html
${existingCode}
\`\`\`

**Instructions:**
Generate the new, complete HTML code that fulfills the user's prompt by iterating on the existing code provided. Your response MUST BE ONLY the raw HTML code, without any markdown formatting, explanations, or code fences (like \`\`\`html).
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating code with Gemini:", error);
    return `<!-- Error generating code. Please check your API key and network connection. -->\n${existingCode}`;
  }
};