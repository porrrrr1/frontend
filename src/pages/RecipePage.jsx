import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function RecipePage() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">สูตรอาหารทั้งหมด</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipes.map(recipe => (
          <div key={recipe.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{recipe.title}</h2>
            <p>{recipe.content}</p>
            <Link to={`/recipe/${recipe.id}`} className="text-blue-500">ดูเพิ่มเติม</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
