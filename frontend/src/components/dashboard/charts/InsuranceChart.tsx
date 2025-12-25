import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type InsuranceChartProps = {
    data: { name: string; volume: number; avgDays: number }[];
};

const InsuranceChart = ({ data }: InsuranceChartProps) => {
    const chartData = data.map((item) => ({
        name: item.name,
        volume: item.volume,
        avgDays: item.avgDays,
    }));

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#8B6F47' }}
                    stroke="#8B6F47"
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
                    formatter={(value: number, name: string) => {
                        if (name === 'volume') {
                            return [
                                `$${value.toLocaleString()}`,
                                'Claim Volume',
                            ];
                        }
                        return [`${value} days`, 'Avg Days'];
                    }}
                />
                <Bar
                    dataKey="volume"
                    fill="#C56211"
                    radius={[8, 8, 0, 0]}
                    name="volume"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default InsuranceChart;
