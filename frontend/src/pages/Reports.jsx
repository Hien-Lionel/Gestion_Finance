import { Typography, Card, Row, Col, Button, message, Statistic } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useCurrency } from '../context/CurrencyContext';

const { Title } = Typography;

const Reports = () => {
  const { formatMoney } = useCurrency();

  const treasuryData = [
    { name: 'Jan', solde: 7872000 },
    { name: 'Fév', solde: 9840000 },
    { name: 'Mar', solde: 8528000 },
    { name: 'Avr', solde: 11808000 },
    { name: 'Mai', solde: 14432000 },
    { name: 'Juin', solde: 16400000 },
  ];

  const categoryData = [
    { name: 'Ventes', revenus: 8200000, depenses: 1640000 },
    { name: 'Services', revenus: 5740000, depenses: 820000 },
    { name: 'Abonnements', revenus: 2460000, depenses: 1312000 },
    { name: 'Autres', revenus: 1640000, depenses: 984000 },
  ];

  const handleExportPDF = () => {
    import('../utils/exportUtils').then(({ exportToPDF }) => {
      // Create a unified data structure for reports export
      const exportData = treasuryData.map((t, index) => {
        const cat = categoryData[index % categoryData.length];
        return {
          month: t.name,
          treasury_balance: formatMoney(t.solde),
          top_category: cat ? cat.name : '-',
          revenues: cat ? formatMoney(cat.revenus) : '-',
          expenses: cat ? formatMoney(cat.depenses) : '-',
        };
      });

      const columns = [
        { title: 'Mois', dataIndex: 'month' },
        { title: 'Solde Trésorerie', dataIndex: 'treasury_balance' },
        { title: 'Catégorie Principale', dataIndex: 'top_category' },
        { title: 'Revenus', dataIndex: 'revenues' },
        { title: 'Dépenses', dataIndex: 'expenses' },
      ];

      exportToPDF(exportData, columns, 'Rapport Financier Mensuel', 'rapport_financier');
      message.success('Génération du PDF en cours...');
    });
  };

  const handleExportCSV = () => {
    import('../utils/exportUtils').then(({ exportToCSV }) => {
      exportToCSV(categoryData, [
        { title: 'Catégorie', dataIndex: 'name' },
        { title: 'Revenus', dataIndex: 'revenus' },
        { title: 'Dépenses', dataIndex: 'depenses' }
      ], 'rapport_categories');
      message.success('Export CSV généré avec succès !');
    });
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={2} style={{ margin: 0 }}>📈 Rapports et Analyses</Title></Col>
        <Col>
          <Button icon={<FilePdfOutlined />} style={{ marginRight: 8 }} onClick={handleExportPDF}>Exporter PDF</Button>
          <Button icon={<FileExcelOutlined />} onClick={handleExportCSV}>Exporter CSV</Button>
        </Col>
      </Row>

      {/* Summary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Revenus Totaux" value={formatMoney(16400000)} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Dépenses Totales" value={formatMoney(9184000)} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Statistic title="Bénéfice Net" value={formatMoney(7216000)} valueStyle={{ color: '#667eea' }} />
          </Card>
        </Col>
      </Row>

      {/* Treasury Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card bordered={false} title="Évolution de la Trésorerie" style={{ borderRadius: 12 }}>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={treasuryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => formatMoney(value)} />
                  <Line type="monotone" dataKey="solde" name="Solde" stroke="#667eea" activeDot={{ r: 8 }} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Category Breakdown */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card bordered={false} title="Revenus vs Dépenses par Catégorie" style={{ borderRadius: 12 }}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => formatMoney(value)} />
                  <Legend />
                  <Bar dataKey="revenus" name="Revenus" fill="#52c41a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="depenses" name="Dépenses" fill="#f5222d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
