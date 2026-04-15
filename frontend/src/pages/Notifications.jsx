import { List, Typography, Badge, Card, Tag, Button, Row, Col } from 'antd';
import { AlertOutlined, InfoCircleOutlined, CheckCircleOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const { Title } = Typography;

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'error': return <AlertOutlined style={{ color: '#cf1322', fontSize: 24 }} />;
      case 'success': return <CheckCircleOutlined style={{ color: '#3f8600', fontSize: 24 }} />;
      default: return <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 24 }} />;
    }
  };

  const getTag = (type) => {
    switch (type) {
      case 'error': return <Tag color="red">Urgent</Tag>;
      case 'success': return <Tag color="green">Positif</Tag>;
      default: return <Tag color="blue">Info</Tag>;
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Notifications <Badge count={unreadCount} offset={[10, -5]} />
          </Title>
        </Col>
        <Col>
          {unreadCount > 0 && (
            <Button icon={<CheckOutlined />} onClick={markAllAsRead}>
              Tout marquer comme lu
            </Button>
          )}
        </Col>
      </Row>
      
      <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 12 }}>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={item => (
            <List.Item
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'background 0.2s',
                background: item.read ? 'transparent' : 'rgba(102, 126, 234, 0.04)',
              }}
              onClick={() => {
                markAsRead(item.id);
                navigate(item.link);
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.background = item.read ? 'transparent' : 'rgba(102, 126, 234, 0.04)'}
              extra={<RightOutlined style={{ color: '#bfbfbf' }} />}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ position: 'relative' }}>
                    {getIcon(item.type)}
                    {!item.read && (
                      <div style={{
                        position: 'absolute', top: -2, right: -2,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#667eea',
                      }} />
                    )}
                  </div>
                }
                title={
                  <span style={{ fontWeight: item.read ? 400 : 600, fontSize: 16 }}>
                    {item.title} {getTag(item.type)}
                  </span>
                }
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notifications;
