import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from 'recharts';

type ProfitabilityLineChartProps = {
    data: { month: string; profitMargin: number; target: number }[];
};

const ProfitabilityLineChart = ({ data }: ProfitabilityLineChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#8B6F47' }}
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
                    formatter={(value: number) => [`${value}%`, '']}
                />
                <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
                <Line
                    type="monotone"
                    dataKey="profitMargin"
                    stroke="#C56211"
                    strokeWidth={2}
                    name="Profit Margin"
                    dot={{ fill: '#C56211', r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#8B6F47"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target"
                    dot={{ fill: '#8B6F47', r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ProfitabilityLineChart;
