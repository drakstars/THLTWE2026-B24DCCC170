import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message, Space, Card, 
  Tabs, Tag, Select, DatePicker, Row, Col, Statistic, Slider, Descriptions, Badge 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, SearchOutlined, EditOutlined, ShoppingCartOutlined,
  DollarOutlined, ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment, { Moment } from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface OrderProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  createdAt: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2026-01-20T10:00:00'
  }
];

const QuanLySanPham: React.FC = () => {
  // Load data từ localStorage hoặc dùng dữ liệu mẫu
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const [orderSearchText, setOrderSearchText] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);

  const [isProductModalVisible, setIsProductModalVisible] = useState<boolean>(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState<boolean>(false);
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [productForm] = Form.useForm();
  const [orderForm] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});

  // Lưu vào localStorage khi dữ liệu thay đổi
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Lấy danh mục duy nhất
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = !selectedCategory || product.category === selectedCategory;
      const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchStatus = !statusFilter || getProductStatus(product.quantity) === statusFilter;
      return matchSearch && matchCategory && matchPrice && matchStatus;
    });
  }, [products, searchText, selectedCategory, priceRange, statusFilter]);

  // Lọc đơn hàng
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch = order.customerName.toLowerCase().includes(orderSearchText.toLowerCase()) ||
                         order.id.toLowerCase().includes(orderSearchText.toLowerCase());
      const matchStatus = !orderStatusFilter || order.status === orderStatusFilter;
      const matchDate = !dateRange[0] || !dateRange[1] || 
                       (moment(order.createdAt).isAfter(dateRange[0]) && 
                        moment(order.createdAt).isBefore(dateRange[1].clone().add(1, 'day')));
      return matchSearch && matchStatus && matchDate;
    });
  }, [orders, orderSearchText, orderStatusFilter, dateRange]);

  // Tính toán thống kê
  const statistics = useMemo(() => {
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const totalOrders = orders.length;
    const revenue = orders
      .filter(o => o.status === 'Hoàn thành')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    const ordersByStatus = {
      'Chờ xử lý': orders.filter(o => o.status === 'Chờ xử lý').length,
      'Đang giao': orders.filter(o => o.status === 'Đang giao').length,
      'Hoàn thành': orders.filter(o => o.status === 'Hoàn thành').length,
      'Đã hủy': orders.filter(o => o.status === 'Đã hủy').length,
    };

    return { totalProducts, totalInventoryValue, totalOrders, revenue, ordersByStatus };
  }, [products, orders]);

  // Hàm xác định trạng thái sản phẩm
  const getProductStatus = (quantity: number) => {
    if (quantity === 0) return 'Hết hàng';
    if (quantity <= 10) return 'Sắp hết';
    return 'Còn hàng';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Còn hàng': return 'success';
      case 'Sắp hết': return 'warning';
      case 'Hết hàng': return 'error';
      default: return 'default';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xử lý': return 'default';
      case 'Đang giao': return 'processing';
      case 'Hoàn thành': return 'success';
      case 'Đã hủy': return 'error';
      default: return 'default';
    }
  };

  // Xử lý sản phẩm
  const showProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      productForm.setFieldsValue(product);
    } else {
      setEditingProduct(null);
      productForm.resetFields();
    }
    setIsProductModalVisible(true);
  };

  const handleProductCancel = () => {
    setIsProductModalVisible(false);
    setEditingProduct(null);
    productForm.resetFields();
  };

  const handleProductSubmit = (values: any) => {
    if (editingProduct) {
      // Sửa sản phẩm
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...values } : p
      ));
      message.success('Cập nhật sản phẩm thành công!');
    } else {
      // Thêm sản phẩm mới
      const newProduct: Product = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...values
      };
      setProducts([...products, newProduct]);
      message.success('Thêm sản phẩm thành công!');
    }
    setIsProductModalVisible(false);
    setEditingProduct(null);
    productForm.resetFields();
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
    message.success('Xóa sản phẩm thành công!');
  };

  // Xử lý đơn hàng
  const showOrderModal = () => {
    setIsOrderModalVisible(true);
    setSelectedProducts([]);
    setProductQuantities({});
    orderForm.resetFields();
  };

  const handleOrderCancel = () => {
    setIsOrderModalVisible(false);
    orderForm.resetFields();
    setSelectedProducts([]);
    setProductQuantities({});
  };

  const handleProductSelectChange = (productIds: number[]) => {
    setSelectedProducts(productIds);
    // Reset số lượng cho các sản phẩm bị bỏ chọn
    const newQuantities = { ...productQuantities };
    Object.keys(newQuantities).forEach(key => {
      if (!productIds.includes(Number(key))) {
        delete newQuantities[Number(key)];
      }
    });
    setProductQuantities(newQuantities);
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setProductQuantities({
      ...productQuantities,
      [productId]: quantity
    });
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, productId) => {
      const product = products.find(p => p.id === productId);
      const quantity = productQuantities[productId] || 0;
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const handleOrderSubmit = (values: any) => {
    // Kiểm tra số lượng
    for (const productId of selectedProducts) {
      const quantity = productQuantities[productId];
      if (!quantity || quantity <= 0) {
        message.error('Vui lòng nhập số lượng cho tất cả sản phẩm!');
        return;
      }
      const product = products.find(p => p.id === productId);
      if (product && quantity > product.quantity) {
        message.error(`Số lượng ${product.name} vượt quá tồn kho!`);
        return;
      }
    }

    const orderProducts: OrderProduct[] = selectedProducts.map(productId => {
      const product = products.find(p => p.id === productId)!;
      return {
        productId: product.id,
        productName: product.name,
        quantity: productQuantities[productId],
        price: product.price
      };
    });

    const newOrder: Order = {
      id: `DH${String(orders.length + 1).padStart(3, '0')}`,
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: orderProducts,
      totalAmount: calculateTotal(),
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString()
    };

    setOrders([...orders, newOrder]);
    message.success('Tạo đơn hàng thành công!');
    handleOrderCancel();
  };

  const handleOrderStatusChange = (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;
    
    // Cập nhật trạng thái
    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus as any } : o
    );
    setOrders(updatedOrders);

    // Xử lý tồn kho
    if (newStatus === 'Hoàn thành' && oldStatus !== 'Hoàn thành') {
      // Trừ tồn kho khi hoàn thành
      const updatedProducts = [...products];
      order.products.forEach(orderProduct => {
        const productIndex = updatedProducts.findIndex(p => p.id === orderProduct.productId);
        if (productIndex !== -1) {
          updatedProducts[productIndex].quantity -= orderProduct.quantity;
        }
      });
      setProducts(updatedProducts);
      message.success('Đơn hàng đã hoàn thành và cập nhật tồn kho!');
    } else if (newStatus === 'Đã hủy' && oldStatus !== 'Đã hủy') {
      // Hoàn trả tồn kho khi hủy (nếu đã trừ trước đó)
      if (oldStatus === 'Hoàn thành') {
        const updatedProducts = [...products];
        order.products.forEach(orderProduct => {
          const productIndex = updatedProducts.findIndex(p => p.id === orderProduct.productId);
          if (productIndex !== -1) {
            updatedProducts[productIndex].quantity += orderProduct.quantity;
          }
        });
        setProducts(updatedProducts);
      }
      message.success('Đơn hàng đã hủy!');
    } else {
      message.success('Cập nhật trạng thái đơn hàng thành công!');
    }
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailModalVisible(true);
  };

  // Cột bảng sản phẩm
  const productColumns: ColumnsType<Product> = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      align: 'right',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const status = getProductStatus(record.quantity);
        return <Tag color={getStatusColor(status)}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => showProductModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Cột bảng đơn hàng
  const orderColumns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số sản phẩm',
      key: 'productCount',
      width: 120,
      align: 'center',
      render: (_, record) => record.products.reduce((sum, p) => sum + p.quantity, 0),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      align: 'right',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status: string, record) => (
        <Select
          value={status}
          style={{ width: '100%' }}
          onChange={(value) => handleOrderStatusChange(record.id, value)}
        >
          <Option value="Chờ xử lý">
            <Tag color={getOrderStatusColor('Chờ xử lý')}>Chờ xử lý</Tag>
          </Option>
          <Option value="Đang giao">
            <Tag color={getOrderStatusColor('Đang giao')}>Đang giao</Tag>
          </Option>
          <Option value="Hoàn thành">
            <Tag color={getOrderStatusColor('Hoàn thành')}>Hoàn thành</Tag>
          </Option>
          <Option value="Đã hủy">
            <Tag color={getOrderStatusColor('Đã hủy')}>Đã hủy</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button type="link" onClick={() => showOrderDetail(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  // Render Dashboard
  const renderDashboard = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={statistics.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng giá trị tồn kho"
              value={statistics.totalInventoryValue}
              prefix={<DollarOutlined />}
              formatter={(value) => 
                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)
              }
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={statistics.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu (Hoàn thành)"
              value={statistics.revenue}
              prefix={<CheckCircleOutlined />}
              formatter={(value) => 
                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)
              }
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card title="Trạng thái đơn hàng">
        <Row gutter={16}>
          <Col span={6}>
            <Badge count={statistics.ordersByStatus['Chờ xử lý']} showZero>
              <Card size="small">
                <Statistic
                  title="Chờ xử lý"
                  value={statistics.ordersByStatus['Chờ xử lý']}
                  valueStyle={{ fontSize: 24 }}
                />
              </Card>
            </Badge>
          </Col>
          <Col span={6}>
            <Badge count={statistics.ordersByStatus['Đang giao']} showZero>
              <Card size="small">
                <Statistic
                  title="Đang giao"
                  value={statistics.ordersByStatus['Đang giao']}
                  valueStyle={{ fontSize: 24, color: '#1890ff' }}
                />
              </Card>
            </Badge>
          </Col>
          <Col span={6}>
            <Badge count={statistics.ordersByStatus['Hoàn thành']} showZero>
              <Card size="small">
                <Statistic
                  title="Hoàn thành"
                  value={statistics.ordersByStatus['Hoàn thành']}
                  valueStyle={{ fontSize: 24, color: '#52c41a' }}
                />
              </Card>
            </Badge>
          </Col>
          <Col span={6}>
            <Badge count={statistics.ordersByStatus['Đã hủy']} showZero>
              <Card size="small">
                <Statistic
                  title="Đã hủy"
                  value={statistics.ordersByStatus['Đã hủy']}
                  valueStyle={{ fontSize: 24, color: '#ff4d4f' }}
                />
              </Card>
            </Badge>
          </Col>
        </Row>
      </Card>
    </Space>
  );

  // Render trang sản phẩm
  const renderProductsPage = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Bộ lọc */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input.Search
              placeholder="Tìm kiếm theo tên sản phẩm..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Chọn danh mục"
              style={{ width: '100%' }}
              allowClear
              value={selectedCategory || undefined}
              onChange={(value) => setSelectedCategory(value || '')}
            >
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: '100%' }}
              allowClear
              value={statusFilter || undefined}
              onChange={(value) => setStatusFilter(value || '')}
            >
              <Option value="Còn hàng">Còn hàng</Option>
              <Option value="Sắp hết">Sắp hết</Option>
              <Option value="Hết hàng">Hết hàng</Option>
            </Select>
          </Col>
          <Col span={6}>
            <div>
              <div style={{ marginBottom: 8 }}>Khoảng giá: {new Intl.NumberFormat('vi-VN').format(priceRange[0])} - {new Intl.NumberFormat('vi-VN').format(priceRange[1])} VNĐ</div>
              <Slider
                range
                min={0}
                max={50000000}
                step={1000000}
                value={priceRange}
                onChange={(value) => setPriceRange(value as [number, number])}
              />
            </div>
          </Col>
          <Col span={2}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showProductModal()}>
              Thêm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Bảng sản phẩm */}
      <Table
        columns={productColumns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showTotal: (total) => `Tổng số: ${total} sản phẩm`,
        }}
        bordered
      />
    </Space>
  );

  // Render trang đơn hàng
  const renderOrdersPage = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Bộ lọc */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Input.Search
              placeholder="Tìm kiếm theo tên khách hàng hoặc mã đơn hàng..."
              allowClear
              enterButton={<SearchOutlined />}
              value={orderSearchText}
              onChange={(e) => setOrderSearchText(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: '100%' }}
              allowClear
              value={orderStatusFilter || undefined}
              onChange={(value) => setOrderStatusFilter(value || '')}
            >
              <Option value="Chờ xử lý">Chờ xử lý</Option>
              <Option value="Đang giao">Đang giao</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Đã hủy">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Moment | null, Moment | null])}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col span={2}>
            <Button type="primary" icon={<PlusOutlined />} onClick={showOrderModal}>
              Tạo đơn
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Bảng đơn hàng */}
      <Table
        columns={orderColumns}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng số: ${total} đơn hàng`,
        }}
        bordered
      />
    </Space>
  );

  return (
    <Card style={{ margin: 24 }}>
      <Tabs defaultActiveKey="dashboard">
        <Tabs.TabPane
          key="dashboard"
          tab={
            <span>
              <ClockCircleOutlined />
              Thống kê tổng quan
            </span>
          }
        >
          {renderDashboard()}
        </Tabs.TabPane>
        <Tabs.TabPane
          key="products"
          tab={
            <span>
              <ShoppingOutlined />
              Quản lý Sản phẩm
            </span>
          }
        >
          {renderProductsPage()}
        </Tabs.TabPane>
        <Tabs.TabPane
          key="orders"
          tab={
            <span>
              <ShoppingCartOutlined />
              Quản lý Đơn hàng
            </span>
          }
        >
          {renderOrdersPage()}
        </Tabs.TabPane>
      </Tabs>

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        visible={isProductModalVisible}
        onCancel={handleProductCancel}
        footer={null}
        width={600}
      >
        <Form
          form={productForm}
          layout="vertical"
          onFinish={handleProductSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
              { whitespace: true, message: 'Tên sản phẩm không được chỉ chứa khoảng trắng!' },
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[
              { required: true, message: 'Vui lòng chọn danh mục!' },
            ]}
          >
            <Select placeholder="Chọn danh mục">
              <Option value="Laptop">Laptop</Option>
              <Option value="Điện thoại">Điện thoại</Option>
              <Option value="Máy tính bảng">Máy tính bảng</Option>
              <Option value="Phụ kiện">Phụ kiện</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
              { type: 'number', min: 1, message: 'Giá phải là số dương!' },
            ]}
          >
            <InputNumber
              placeholder="Nhập giá sản phẩm"
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Số lượng tồn kho"
            name="quantity"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              { type: 'number', min: 0, message: 'Số lượng phải là số không âm!' },
            ]}
          >
            <InputNumber
              placeholder="Nhập số lượng"
              style={{ width: '100%' }}
              min={0}
              precision={0}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleProductCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal tạo đơn hàng */}
      <Modal
        title="Tạo đơn hàng mới"
        visible={isOrderModalVisible}
        onCancel={handleOrderCancel}
        footer={null}
        width={700}
      >
        <Form
          form={orderForm}
          layout="vertical"
          onFinish={handleOrderSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khách hàng!' },
              { whitespace: true, message: 'Tên không được chỉ chứa khoảng trắng!' },
            ]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^0\d{9,10}$/, message: 'Số điện thoại không đúng định dạng (10-11 số, bắt đầu bằng 0)!' },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ!' },
              { whitespace: true, message: 'Địa chỉ không được chỉ chứa khoảng trắng!' },
            ]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ giao hàng" rows={2} />
          </Form.Item>

          <Form.Item
            label="Chọn sản phẩm"
            name="products"
            rules={[
              { required: true, message: 'Vui lòng chọn ít nhất một sản phẩm!' },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
              style={{ width: '100%' }}
              onChange={handleProductSelectChange}
            >
              {products.filter(p => p.quantity > 0).map(product => (
                <Option key={product.id} value={product.id}>
                  {product.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)} (Còn: {product.quantity})
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedProducts.length > 0 && (
            <Card title="Số lượng từng sản phẩm" size="small" style={{ marginBottom: 16 }}>
              {selectedProducts.map(productId => {
                const product = products.find(p => p.id === productId);
                return (
                  <Row key={productId} gutter={16} style={{ marginBottom: 12 }} align="middle">
                    <Col span={12}>
                      <strong>{product?.name}</strong>
                    </Col>
                    <Col span={12}>
                      <InputNumber
                        min={1}
                        max={product?.quantity}
                        placeholder="Số lượng"
                        style={{ width: '100%' }}
                        value={productQuantities[productId]}
                        onChange={(value) => handleQuantityChange(productId, value || 0)}
                      />
                      <span style={{ fontSize: 12, color: '#888' }}> (Tối đa: {product?.quantity})</span>
                    </Col>
                  </Row>
                );
              })}
              <Row style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <Col span={12}>
                  <strong>Tổng tiền:</strong>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                  </strong>
                </Col>
              </Row>
            </Card>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleOrderCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Tạo đơn hàng
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
        visible={isOrderDetailModalVisible}
        onCancel={() => setIsOrderDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsOrderDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedOrder && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã đơn hàng" span={2}>
                <strong>{selectedOrder.id}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedOrder.address}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getOrderStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {moment(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalAmount)}
                </strong>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Danh sách sản phẩm" size="small">
              <Table
                dataSource={selectedOrder.products}
                rowKey="productId"
                pagination={false}
                columns={[
                  {
                    title: 'STT',
                    key: 'stt',
                    width: 60,
                    render: (_, __, index) => index + 1,
                  },
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: 'productName',
                    key: 'productName',
                  },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'price',
                    key: 'price',
                    align: 'right',
                    render: (price: number) => 
                      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    align: 'center',
                  },
                  {
                    title: 'Thành tiền',
                    key: 'total',
                    align: 'right',
                    render: (_, record) => 
                      new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price * record.quantity),
                  },
                ]}
              />
            </Card>
          </Space>
        )}
      </Modal>
    </Card>
  );
};

export default QuanLySanPham;
