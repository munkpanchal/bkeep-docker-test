import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from 'recharts';

type ChairUtilizationChartProps = {
    data: {
        location: string;
        utilization: number;
        revenue: number;
    }[];
};

const ChairUtilizationChart = ({ data }: ChairUtilizationChartProps) => {
    const chartData = data.map((item) => ({
        name: item.location.split(' - ')[1] || item.location,
        utilization: item.utilization,
        revenue: item.revenue,
    }));

    const getColor = (utilization: number) => {
        if (utilization < 50) return '#EF4444'; // red
        if (utilization < 70) return '#F59E0B'; // yellow
        return '#10B981'; // green
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#8B6F47' }}
                    stroke="#8B6F47"
                />
                <YAxis
                    tick={{ fontSize: 12, fill: '#8B6F47' }}
                    stroke="#8B6F47"
                    tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #C56211',
                        borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => {
                        if (name === 'utilization') {
                            return [`${value}%`, 'Utilization'];
                        }
                        return [`$${value.toLocaleString()}`, 'Revenue/Hour'];
                    }}
                />
                <Bar dataKey="utilization" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={getColor(entry.utilization)}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ChairUtilizationChart;
