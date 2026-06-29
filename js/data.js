// Furniture product data
const products = [
  {
    id: 1,
    name: '北欧简约布艺沙发',
    category: '沙发',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    description: '高密度海绵填充，棉麻面料，舒适透气，适合小户型客厅，北欧风格百搭',
    keywords: ['北欧', '布艺', '小户型', '客厅', '简约', '三人位']
  },
  {
    id: 2,
    name: '意式真皮沙发',
    category: '沙发',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop',
    description: '头层牛皮，实木框架，经典意式设计，彰显奢华品味，适合大户型客厅',
    keywords: ['意式', '真皮', '大户型', '客厅', '奢华', '高端']
  },
  {
    id: 3,
    name: '日式懒人沙发',
    category: '沙发',
    price: 899,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: '微粒子填充，可拆洗外套，轻便移动，阳台卧室皆可使用',
    keywords: ['日式', '懒人', '单人', '阳台', '卧室', '休闲']
  },
  {
    id: 4,
    name: '北欧实木双人床',
    category: '床',
    price: 4599,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
    description: '北美白橡木，环保清漆，承重300kg，简约大气，经久耐用',
    keywords: ['北欧', '实木', '双人', '白橡木', '主卧', '简约']
  },
  {
    id: 5,
    name: '真皮软包床',
    category: '床',
    price: 5299,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    description: '纳帕头层皮，排骨架床板，舒适靠包，高端卧室首选',
    keywords: ['真皮', '软包', '双人', '主卧', '高端', '舒适']
  },
  {
    id: 6,
    name: '儿童上下铺',
    category: '床',
    price: 3599,
    image: 'https://images.unsplash.com/photo-1505692952047-1a78307d8e4b?w=400&h=400&fit=crop',
    description: '松木实木，圆角设计，安全环保，二胎家庭必备',
    keywords: ['儿童', '上下铺', '实木', '子母床', '二胎', '松木']
  },
  {
    id: 7,
    name: '实木餐桌椅套装',
    category: '桌椅',
    price: 2699,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop',
    description: '白橡木餐桌+4把餐椅，北欧风格，家庭聚餐温馨之选',
    keywords: ['餐桌', '餐椅', '套装', '实木', '白橡木', '北欧', '餐厅']
  },
  {
    id: 8,
    name: '北欧简约书桌',
    category: '桌椅',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
    description: '加厚板材，大抽屉储物，宽敞桌面，居家办公学习首选',
    keywords: ['书桌', '简约', '北欧', '学习桌', '办公', '书房']
  },
  {
    id: 9,
    name: '意式轻奢梳妆台',
    category: '桌椅',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1597006335772-2be08e0a3cc2?w=400&h=400&fit=crop',
    description: '岩板台面，LED智能镜，大容量储物，精致女生最爱',
    keywords: ['梳妆台', '意式', '轻奢', '化妆台', '岩板', 'LED镜']
  },
  {
    id: 10,
    name: '三门实木衣柜',
    category: '柜子',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1597006335772-2be08e0a3cc2?w=400&h=400&fit=crop',
    description: '北美红橡木，大容量储物空间，分区合理，经久耐用',
    keywords: ['衣柜', '实木', '三门', '红橡木', '储物', '主卧']
  },
  {
    id: 11,
    name: '实木书柜',
    category: '柜子',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
    description: '多层可调节隔板，钢化玻璃门，防尘展示两不误',
    keywords: ['书柜', '实木', '玻璃门', '书房', '展示柜', '收纳']
  },
  {
    id: 12,
    name: '北欧电视柜',
    category: '柜子',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=400&h=400&fit=crop',
    description: '实木框架，抽屉+开放格设计，简约百搭，客厅收纳好帮手',
    keywords: ['电视柜', '北欧', '实木', '客厅', '简约', '抽屉']
  },
  {
    id: 13,
    name: '简约落地灯',
    category: '灯具',
    price: 399,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop',
    description: '三档调光，暖光LED，简约设计，客厅卧室皆可使用',
    keywords: ['落地灯', '简约', 'LED', '暖光', '客厅', '卧室', '调光']
  },
  {
    id: 14,
    name: '轻奢吊灯',
    category: '灯具',
    price: 699,
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803239db7?w=400&h=400&fit=crop',
    description: '黄铜材质，三头设计，客厅餐厅适用，轻奢风格点亮家居',
    keywords: ['吊灯', '轻奢', '黄铜', '客厅', '餐厅', '创意']
  },
  {
    id: 15,
    name: '智能台灯',
    category: '灯具',
    price: 259,
    image: 'https://images.unsplash.com/photo-1525974160448-1b0d1f9fb05b?w=400&h=400&fit=crop',
    description: '无频闪护眼，触控调光，三档色温，学生护眼必备',
    keywords: ['台灯', '智能', '护眼', '学生', '触控', 'LED']
  },
  {
    id: 16,
    name: '现代简约床头柜',
    category: '柜子',
    price: 599,
    image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&h=400&fit=crop',
    description: '实木腿+储物抽屉，小巧实用，卧室床头百搭小助手',
    keywords: ['床头柜', '简约', '实木', '卧室', '储物', '抽屉']
  }
];

// Category data
const categories = [
  { name: '沙发', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=600&fit=crop' },
  { name: '床', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=600&fit=crop' },
  { name: '桌椅', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=600&fit=crop' },
  { name: '柜子', image: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=400&h=600&fit=crop' },
  { name: '灯具', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=600&fit=crop' }
];
