import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAnimal, getProducts, getComments, addComment } from '../../services/api';
import { useAuth, useCart } from '../../context';

const EMOJI = {
  cow: '🐄',
  sheep: '🐑',
  chicken: '🐓',
  rabbit: '🐇',
  other: '🐾'
};

const Stars = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button
        key={s}
        type="button"
        onClick={() => onChange?.(s)}
        className={`text-2xl ${s <= value ? 'text-amber-400' : 'text-gray-200'}`}
      >
        ★
      </button>
    ))}
  </div>
);

export default function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [animal, setAnimal] = useState(null);
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  const [comment, setComment] = useState({ text: '', rating: 5 });
  const [sending, setSending] = useState(false);

  const API_BASE =
    (process.env.REACT_APP_API_URL || '').replace('/api', '');

  useEffect(() => {
    const load = async () => {
      try {
        const [a, p, c] = await Promise.all([
          getAnimal(id),
          getProducts(),
          getComments(id)
        ]);

        const animalData = a?.data;
        setAnimal(animalData);

        setProducts(
          (p?.data || []).filter(
            prod =>
              prod.animal_id?._id === id ||
              prod.animal_id === id
          )
        );

        setComments(c?.data || []);
      } catch (err) {
        toast.error('Error loading animal');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!user) return navigate('/login');
    if (!comment.text.trim()) return;

    setSending(true);
    try {
      const res = await addComment({
        animal_id: id,
        ...comment
      });

      setComments(prev => [res.data, ...prev]);
      setComment({ text: '', rating: 5 });
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSending(false);
    }
  };

  const handleAddProduct = (product) => {
    if (!user) return navigate('/login');

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.final_price || product.price,
      unit: product.unit,
      type: 'product'
    });

    toast.success('Added to cart');
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );

  if (!animal)
    return (
      <div className="text-center py-20 text-gray-400">
        Animal not found
      </div>
    );

  const avgRating = comments.length
    ? (
        comments.reduce((s, c) => s + c.rating, 0) /
        comments.length
      ).toFixed(1)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* HEADER */}
      <button onClick={() => navigate(-1)} className="text-gray-400 mb-4">
        ← Back
      </button>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* IMAGE */}
        <div>
          <div className="h-72 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
            {animal.images?.[imgIdx] ? (
              <img
                src={`${API_BASE}${animal.images[imgIdx]}`}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">
                {EMOJI[animal.type]}
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            {animal.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-14 h-14 overflow-hidden rounded-lg border ${
                  i === imgIdx ? 'border-green-500' : ''
                }`}
              >
                <img
                  src={`${API_BASE}${img}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <h1 className="text-3xl font-bold">{animal.name}</h1>
          <p className="text-gray-400">
            {EMOJI[animal.type]} {animal.type}
          </p>

          {avgRating && (
            <div className="flex items-center gap-2 mt-2">
              <Stars value={Math.round(avgRating)} />
              <span className="text-sm text-gray-500">
                {avgRating} / 5
              </span>
            </div>
          )}

          <p className="mt-4 text-gray-600">
            {animal.description}
          </p>

          {/* BUY ANIMAL */}
          {animal.for_sale && animal.status === 'available' && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
              <p className="font-bold text-yellow-700 mb-2">
                Buy this animal
              </p>

              <button
                onClick={() => {
                  addToCart({
                    _id: animal._id,
                    name: animal.name,
                    price: animal.sale_price,
                    type: 'animal'
                  });
                  toast.success('Added to cart');
                }}
                className="btn-primary w-full"
              >
                Add to cart ({animal.sale_price} MAD)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCTS */}
      {products.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">
            Products
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p._id} className="card">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-green-600 font-bold">
                  {p.final_price || p.price} MAD
                </p>

                <button
                  onClick={() => handleAddProduct(p)}
                  className="btn-primary mt-2 w-full"
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMENTS */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">
          Reviews
        </h2>

        {user ? (
          <form onSubmit={handleAddComment} className="card">
            <Stars
              value={comment.rating}
              onChange={(r) =>
                setComment(p => ({ ...p, rating: r }))
              }
            />

            <textarea
              className="input mt-2"
              placeholder="Write comment..."
              value={comment.text}
              onChange={(e) =>
                setComment(p => ({
                  ...p,
                  text: e.target.value
                }))
              }
            />

            <button
              disabled={sending}
              className="btn-primary mt-3"
            >
              Send
            </button>
          </form>
        ) : (
          <p className="text-gray-400">
            Login to comment
          </p>
        )}

        <div className="mt-6 space-y-3">
          {comments.map(c => (
            <div key={c._id} className="card">
              <p className="font-medium">
                {c.user_id?.name || 'User'}
              </p>
              <Stars value={c.rating} />
              <p className="text-gray-600 text-sm">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
