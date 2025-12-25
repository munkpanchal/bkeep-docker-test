import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

type ExpensePieChartProps = {
    data: { category: string; amount: number; percentage: number }[];
};

const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
    const chartData = data.map((item) => ({
        name: item.category,
        value: item.amount,
        percentage: item.percentage,
    }));

    const COLORS = ['#C56211', '#8B6F47', '#D4A574', '#F5E6D3', '#E8D5C4'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-primary-25 rounded-lg shadow-md">
                    <p className="font-semibold text-primary">
                        {payload[0].name}
                    </p>
                    <p className="text-sm text-primary-75">
                        ${payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-xs text-primary-50">
                        {payload[0].payload.percentage}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((_, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                    iconType="circle"
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ExpensePieChart;
