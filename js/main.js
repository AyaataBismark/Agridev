// Agridev — main.js (frontend-only demo)
const products = [
  {id:1,slug:'pear',title:'Pears (Premium)',category:'fruits',price:2.5,unit:'kg',farmer:'Sunrise Farm',location:'Nakuru',img:'assets/photos/pear.jpg',fallback:'assets/mango.svg',qty:120,desc:'Sweet juicy pears, harvested this week.'},
  {id:2,slug:'carrot',title:'Carrots (Organic)',category:'vegetables',price:1.2,unit:'kg',farmer:'Green Valley',location:'Kericho',img:'assets/photos/carrot.jpg',fallback:'assets/carrot.svg',qty:80,desc:'Crunchy organic carrots.'},
  {id:3,slug:'maize',title:'Maize (Dry)',category:'grains',price:0.45,unit:'kg',farmer:'Highland Co-op',location:'Embu',img:'assets/photos/maize.jpg',fallback:'assets/maize.svg',qty:500,desc:'Dried maize, well-stored.'},
  {id:4,slug:'tomato',title:'Tomatoes (Vine)',category:'vegetables',price:1.6,unit:'kg',farmer:'Riverbank Farm',location:'Mombasa',img:'assets/photos/tomato.jpg',fallback:'assets/tomato.svg',qty:60,desc:'Juicy vine-ripened tomatoes.'},
  {id:5,slug:'onion',title:'Onions (Fresh)',category:'vegetables',price:0.8,unit:'kg',farmer:'Valley Green',location:'Eldoret',img:'assets/photos/onion.jpg',fallback:'assets/produce-placeholder.png',qty:200,desc:'Fresh white onions, perfect for cooking.'},
  {id:6,slug:'ginger',title:'Ginger (Organic)',category:'vegetables',price:3.2,unit:'kg',farmer:'Spice Gardens',location:'Meru',img:'assets/photos/ginger.jpg',fallback:'assets/produce-placeholder.png',qty:50,desc:'Fresh organic ginger root.'},
  {id:7,slug:'garlic',title:'Garlic Bulbs',category:'vegetables',price:4.5,unit:'kg',farmer:'Herb Farm',location:'Nyeri',img:'assets/photos/garlic.jpg',fallback:'assets/produce-placeholder.png',qty:75,desc:'Fresh garlic bulbs, locally grown.'},
  {id:8,slug:'cabbage',title:'Cabbage (Fresh)',category:'vegetables',price:0.6,unit:'kg',farmer:'Green Fields',location:'Nakuru',img:'assets/photos/carbage.jpg',fallback:'assets/produce-placeholder.png',qty:150,desc:'Fresh green cabbage heads.'}
];

// Build a Lunr index for client-side full-text search. Fallback to simple text search if Lunr isn't available.
let lunrIndex = null;
try{
  if(window.lunr){
    lunrIndex = lunr(function(){
      this.ref('id');
      this.field('title');
      this.field('desc');
      this.field('farmer');
      this.field('location');
      this.field('category');
      products.forEach(function(p){ this.add(Object.assign({}, p, {id: String(p.id)})); }, this);
    });
  }
}catch(e){
  console.warn('Lunr index failed to build, falling back to simple search', e);
  lunrIndex = null;
}

// DOM
const productsEl = document.getElementById('products');
const searchEl = document.getElementById('search');
const categoryEl = document.getElementById('category');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const yearEl = document.getElementById('year');

function renderProducts(list){
  productsEl.innerHTML = '';
  if(!list.length){
    productsEl.innerHTML = '<p style="color:var(--muted)">No results. Try another search.</p>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="image-container">
        <img src="${p.img}" alt="${p.title}" data-fallback="${p.fallback}" class="product-image" />
        <div class="image-overlay">
          <span class="category-tag">${p.category}</span>
        </div>
      </div>
      <div class="card-content">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="meta">
          <span class="farmer-name">${p.farmer}</span>
          <span class="location">${p.location}</span>
        </div>
        <div class="pricing">
          <span class="price">$${p.price}/${p.unit}</span>
          <span class="availability">${p.qty} ${p.unit} available</span>
        </div>
        <div class="actions">
          <button class="btn btn-primary" data-id="${p.id}">Inquire</button>
          <button class="btn btn-ghost" data-id="${p.id}" aria-label="View details">Details</button>
        </div>
      </div>
    `;
    productsEl.appendChild(card);

    // Handle image loading errors with fallback
    const imgEl = card.querySelector('img');
    handleImageFallback(imgEl);
  });
}

// Handle image loading with fallback to SVG if photo fails to load
function handleImageFallback(imgEl){
  if(!imgEl) return;
  
  imgEl.addEventListener('error', function(){
    const fallback = this.getAttribute('data-fallback');
    if(fallback && this.src !== fallback){
      console.log(`Photo failed to load, using fallback: ${fallback}`);
      this.src = fallback;
      this.classList.add('fallback-image');
    }
  });

  imgEl.addEventListener('load', function(){
    this.classList.add('loaded');
  });
}

function openModal(html){
  modalContent.innerHTML = html;
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// Event delegation for product buttons
productsEl.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const p = products.find(x => x.id === id);
  if(btn.textContent.trim().toLowerCase() === 'details'){
    openModal(`
      <div class="modal-product-details">
        <div class="modal-image">
          <img src="${p.img}" alt="${p.title}" data-fallback="${p.fallback}" class="modal-product-image"/>
          <span class="category-tag">${p.category}</span>
        </div>
        <div class="modal-info">
          <h3>${p.title}</h3>
          <p class="product-description">${p.desc}</p>
          <div class="product-meta">
            <div class="meta-item">
              <strong>Farmer:</strong> <span>${p.farmer}</span>
            </div>
            <div class="meta-item">
              <strong>Location:</strong> <span>${p.location}</span>
            </div>
            <div class="meta-item">
              <strong>Price:</strong> <span class="price-highlight">$${p.price}/${p.unit}</span>
            </div>
            <div class="meta-item">
              <strong>Available:</strong> <span>${p.qty} ${p.unit}</span>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary" id="inquire-${p.id}">Inquire Now</button>
            <button class="btn btn-ghost" onclick="closeModal()">Close</button>
          </div>
        </div>
      </div>
    `);
    // Handle image fallback in modal too
    const modalImg = document.querySelector('.modal-product-image');
    if(modalImg) handleImageFallback(modalImg);
  } else {
    // Inquire: open modal with quick form prefilled
    openModal(`
      <h3>Inquiry for ${p.title}</h3>
      <p><strong>Farmer:</strong> ${p.farmer} — <strong>Location:</strong> ${p.location}</p>
      <form id="inquiry-form">
        <label>Your name <input required id="inq-name"/></label>
        <label>Your phone or email <input required id="inq-contact"/></label>
        <label>Quantity <input type="number" min="1" value="1" id="inq-qty"/></label>
        <div style="margin-top:0.5rem"><button class="btn btn-primary" type="submit">Send Inquiry</button></div>
      </form>
    `);
    // attach handler after modal content set
    setTimeout(()=>{
      const f = document.getElementById('inquiry-form');
      if(f) f.addEventListener('submit', (ev)=>{
        ev.preventDefault();
        alert('Inquiry sent (demo). The farmer will receive your details.');
        closeModal();
      });
    },30);
  }
});

// modal close
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

// search/filter
function applyFilters(){
  const q = (searchEl.value || '').trim();
  const cat = categoryEl.value;
  let out = products.slice();

  if(q){
    // Use Lunr if available for better results
    if(lunrIndex){
      try{
        // use wildcard search to broaden results
        const res = lunrIndex.search(q + '*');
        const ids = res.map(r => Number(r.ref));
        out = products.filter(p => ids.includes(p.id));
      }catch(e){
        // If lunr search syntax throws, fallback to substring search
        const lq = q.toLowerCase();
        out = products.filter(p => (`${p.title} ${p.desc} ${p.farmer} ${p.location}`).toLowerCase().includes(lq));
      }
    } else {
      const lq = q.toLowerCase();
      out = products.filter(p => (`${p.title} ${p.desc} ${p.farmer} ${p.location}`).toLowerCase().includes(lq));
    }
  }

  if(cat && cat !== 'all'){
    out = out.filter(p => p.category === cat);
  }

  renderProducts(out);
}
searchEl.addEventListener('input', applyFilters);
categoryEl.addEventListener('change', applyFilters);

// contact form
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if(!name || !email || !message) { alert('Please fill all fields.'); return; }
  // demo behavior: show message and clear
  alert('Thanks! Your message was received (demo).');
  contactForm.reset();
});

// init
document.getElementById('open-market').addEventListener('click', ()=> location.hash = '#market');
document.getElementById('cta-explore').addEventListener('click', ()=> location.hash = '#market');
renderProducts(products);
applyFilters();
yearEl.textContent = new Date().getFullYear();

// Handle hero image fallback and enhancement
const heroImage = document.querySelector('.hero-image');
if(heroImage){
  handleImageFallback(heroImage);
  
  // Add subtle parallax effect on scroll
  let ticking = false;
  function updateHeroParallax(){
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    if(heroImage.parentElement){
      heroImage.parentElement.style.transform = `translateY(${rate}px)`;
    }
    ticking = false;
  }
  
  function requestTick(){
    if(!ticking){
      requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

// small accessibility: close modal with Esc
document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal(); });
