const fs = require('fs');
const path = require('path');

const replacements = {
  "Koi product nahi mila 😔": "No products found 😔",
  "Filters clear karo": "Clear filters",
  "Out of stock hai!": "Out of stock!",
  "Cart mein add ho gaya!": "Added to cart!",
  "Review submit ho gaya!": "Review submitted!",
  "Abhi koi review nahi hai — pehle review tum likho!": "No reviews yet. Be the first to review!",
  "Koi orders nahi hain!": "No orders found!",
  "Abhi tak kuch order nahi kiya.": "You haven't placed any orders yet.",
  "Aap apni khud ki role change nahi kar sakte!": "You cannot change your own role!",
  "Kya aap is user ka role badalna chahte hain?": "Are you sure you want to change this user's role?",
  "Kya aap sach me ye product delete karna chahte hain?": "Are you sure you want to delete this product?",
  "Sab detail fields bharna zaroori hain!": "All details are required!",
  "Register fail ho gaya": "Registration failed",
  "Login fail ho gaya": "Login failed",
  "Order place nahi ho saka": "Could not place order"
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const [key, val] of Object.entries(replacements)) {
        if (content.includes(key)) {
          content = content.replaceAll(key, val);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log("Updated", fullPath);
      }
    }
  }
}

processDir('d:/Ecommerce Youtube/frontend/src');
console.log("Done");
