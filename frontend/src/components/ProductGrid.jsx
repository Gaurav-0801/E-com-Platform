import ProductCard from './ProductCard';

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <div className="product-grid">
      <h2 className="section-title">Our Products</h2>
      <div className="products-container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
