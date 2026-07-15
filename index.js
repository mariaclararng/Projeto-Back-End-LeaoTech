const express = require('express');
const cors = require('cors');
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

const apiRoutes = require('./src/routes/apiRoutes');
const app = express();

app.use(cors());
app.use(express.json());

// API para ligar
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Servidor rodando perfeitamente!" });
});
const formatProduct = (data) => ({
  id: data.id,
  category: data.category,
  name: data.name,
  price: data.price,
  image: data.image,
  discount: data.discount,
  discountAmount: data.discount_amount,
  productDetails: {
    brand: data.brand,
    shortName: data.short_name,
    ref: data.ref,
    rating: data.rating,
    reviews: data.reviews_count,
    description: data.description,
    images: data.images,
    availableSizes: data.available_sizes,
    availableColors: data.available_colors,
  },
});

app.get("/listarproducts", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data.map(formatProduct));
});

app.get("/buscarproduct/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(404).json({ erro: "Produto não encontrado" });
  res.json(formatProduct(data));
});

app.get("/buscarproducts", async (req, res) => {
  const { term } = req.query;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("name", `%${term}%`);
  if (error) return res.status(400).json({ erro: error.message });
  res.json(data.map(formatProduct));
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ativo com carinho na porta ${PORT}`);
});
