import app from "./index";
import { seedData } from "./scripts/seed";

const PORT = 5000;

seedData();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});