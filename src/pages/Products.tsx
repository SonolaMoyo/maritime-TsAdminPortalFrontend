import { Panel } from "../components/ui/Card";
import { demo } from "../data/mockData";

export function Products() {
  const fmtMoney = (val: number) => "$" + val.toLocaleString();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Retail Products</h1>
          <p className="text-text mt-2 max-w-[780px]">Add, update and manage products shown on the public website catalogue.</p>
        </div>
      </div>

      <div className="grid grid-cols-[1.1fr_0.9fr] gap-4">
        <Panel>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl tracking-[-0.045em] leading-[1.05] font-bold">Add Product</h2>
              <p className="text-text mt-1.5 text-sm">Product appears in the website catalogue after saving.</p>
            </div>
          </div>
          <form className="grid grid-cols-2 gap-3.5 mt-6">
            <input className="h-[52px] rounded-2xl border border-line px-4 outline-0 bg-white w-full" placeholder="Product name" required />
            <input className="h-[52px] rounded-2xl border border-line px-4 outline-0 bg-white w-full" placeholder="product-slug" required />
            <input className="h-[52px] rounded-2xl border border-line px-4 outline-0 bg-white w-full" placeholder="Brand" />
            <input className="h-[52px] rounded-2xl border border-line px-4 outline-0 bg-white w-full" placeholder="Category" />
            <input className="h-[52px] rounded-2xl border border-line px-4 outline-0 bg-white w-full" type="number" placeholder="Selling price" />
            <input className="h-[52px] rounded-2xl border border-line px-4 outline-0 bg-white w-full" type="number" placeholder="Stock quantity" />
            <input className="h-[52px] rounded-2xl border border-line px-4 outline-0 bg-white w-full col-span-2" placeholder="Image URL" />
            <textarea className="col-span-2 rounded-2xl border border-line p-4 outline-0 bg-white w-full min-h-[126px] resize-y" placeholder="Short product description"></textarea>
            <button className="col-span-2 h-[50px] rounded-full bg-brand-green text-white font-[800] hover:-translate-y-1 transition-transform shadow-[0_18px_42px_rgba(0,86,66,0.18)] cursor-pointer">
              Add Product
            </button>
          </form>
        </Panel>

        <Panel>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl tracking-[-0.045em] leading-[1.05] font-bold">Product List</h2>
              <p className="text-text mt-1.5 text-sm">Searchable product catalogue</p>
            </div>
          </div>
          <div className="grid gap-3 mt-6">
            {demo.products.map(product => (
              <div key={product.id} className="border border-line rounded-2xl p-3.5 bg-white flex justify-between items-center gap-3">
                <div>
                  <b className="block leading-[1.15]">{product.name}</b>
                  <small className="text-text">{product.brand} • {product.category_name} • {fmtMoney(product.price)} • Stock: {product.stock_quantity}</small>
                </div>
                <button className="px-3 py-1.5 rounded-full border border-line bg-white text-sm font-bold hover:bg-gray-50 cursor-pointer">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
