import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type RevenueBarChartProps = {
    data: { name: string; revenue: number; percentage: number }[];
};

const RevenueBarChart = ({ data }: RevenueBarChartProps) => {
    const chartData = data.map((item) => ({
        name: item.name,
        revenue: item.revenue,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#8B6F47' }}
                    stroke="#8B6F47"
                />
                <YAxis
                    tick={{ fontSize: 12, fill: '#8B6F47' }}
                    stroke="#8B6F47"
                    tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #C56211',
                        borderRadius: '8px',
                    }}
                    formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        'Revenue',
                    ]}
                />
                <Bar
                    dataKey="revenue"
                    fill="#C56211"
                    radius={[8, 8, 0, 0]}
                    name="Revenue"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RevenueBarChart;
