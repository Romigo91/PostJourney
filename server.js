const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "sk_Q94e3xilY3hHcZKbWZvLuIUosJXgSKMF";

app.post('/generate', async (req, res) => {
    try {
        console.log(">> Поступил промпт:", req.body.prompt);

        const response = await axios.post('https://gen.pollinations.ai/image/a beautiful sunset over mountains', {
            model: "flux", // Убедись, что модель именно такая в PromptPilot
            prompt: req.body.prompt,
            n: 1,
            size: "1024x1024"
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        // Выводим ошибку в консоль сервера (черное окно)
        const errorData = error.response?.data || error.message;
        console.error("!! Ошибка API:", errorData);
        
        // Отправляем детали ошибки на фронтенд, чтобы fetch не падал "молча"
        res.status(500).json({ 
            error: "Ошибка API", 
            details: errorData 
        });
    }
});

app.listen(3000, () => console.log('✅ Сервер слушает порт 3000'));