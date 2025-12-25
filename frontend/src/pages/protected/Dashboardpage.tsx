import { useEffect, useRef, useState } from "react";
import {
  FaChartLine,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaPiggyBank,
} from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import AIInsightCard from "../../components/dashboard/AIInsightCard";
import ChairUtilizationChart from "../../components/dashboard/charts/ChairUtilizationChart";
import ExpensePieChart from "../../components/dashboard/charts/ExpensePieChart";
import InsuranceChart from "../../components/dashboard/charts/InsuranceChart";
import ProfitabilityLineChart from "../../components/dashboard/charts/ProfitabilityLineChart";
import RevenueBarChart from "../../components/dashboard/charts/RevenueBarChart";
import ChartWidget from "../../components/dashboard/ChartWidget";
import ResizableCard from "../../components/dashboard/ResizableCard";
import SummaryCard from "../../components/dashboard/SummaryCard";

// TODO: Replace with API data fetching
const useDashboardData = () => {
  return {
    // Summary Cards Data
    totalCollections: {
      value: "$124,580",
      trend: { value: 8, direction: "up" as const, period: "last month" },
      breakdown: [
        { label: "Insurance payments", value: "$89,200" },
        { label: "Patient payments", value: "$35,380" },
      ],
      aiNotes: [
        "Collections are tracking 8% above average this month",
        "Insurance payments increased by 12% from last month",
      ],
    },
    outstandingReceivables: {
      value: "$45,230",
      breakdown: [
        { label: "0-30 days", value: "$18,500" },
        { label: "31-60 days", value: "$15,200" },
        { label: "61-90 days", value: "$8,400" },
        { label: "90+ days", value: "$3,130" },
      ],
      aiNotes: ["$12,400 in claims are 60+ days overdue"],
    },
    cashOnHand: {
      value: "$89,450",
      indicator: "green" as const,
      aiNotes: [
        "Forecast shows a cash dip in 2 weeks due to pending lab bills",
      ],
    },
    expenseSummary: {
      value: "$62,300",
      trend: { value: 5, direction: "up" as const, period: "last month" },
      breakdown: [
        { label: "Supplies", value: "$22,100" },
        { label: "Lab Fees", value: "$18,500" },
        { label: "Rent", value: "$12,700" },
      ],
      aiNotes: ["Lab costs are 18% above average — check vendor invoices"],
    },
    profitability: {
      value: "42%",
      trend: {
        value: 3,
        direction: "up" as const,
        period: "3 months avg",
      },
      chartData: [
        { month: "Jan", profitMargin: 38, target: 40 },
        { month: "Feb", profitMargin: 40, target: 40 },
        { month: "Mar", profitMargin: 39, target: 40 },
        { month: "Apr", profitMargin: 41, target: 40 },
        { month: "May", profitMargin: 42, target: 40 },
      ],
    },

    // Revenue by Procedure Type
    revenueByProcedure: [
      { name: "Restorative", revenue: 45200, percentage: 36 },
      { name: "Cosmetic", revenue: 32100, percentage: 26 },
      { name: "Preventive", revenue: 28100, percentage: 23 },
      { name: "Surgical", revenue: 15200, percentage: 12 },
      { name: "Orthodontic", revenue: 3980, percentage: 3 },
    ],

    // Insurance Performance
    insurancePerformance: [
      { name: "Sun Life", volume: 15200, avgDays: 52 },
      { name: "Manulife", volume: 12800, avgDays: 38 },
      { name: "Blue Cross", volume: 11200, avgDays: 45 },
      { name: "Great-West", volume: 9800, avgDays: 42 },
      { name: "Desjardins", volume: 8200, avgDays: 35 },
    ],

    // Dentist Productivity
    dentistProductivity: [
      { name: "Dr. Smith", revenue: 58200, procedures: 145 },
      { name: "Dr. Johnson", revenue: 48400, procedures: 128 },
      { name: "Dr. Williams", revenue: 38900, procedures: 112 },
    ],

    // Chair Utilization
    chairUtilization: [
      {
        location: "Location A - Chair 1",
        utilization: 78,
        revenue: 12400,
      },
      {
        location: "Location A - Chair 2",
        utilization: 65,
        revenue: 11200,
      },
      {
        location: "Location B - Chair 1",
        utilization: 72,
        revenue: 11800,
      },
      {
        location: "Location B - Chair 2",
        utilization: 42,
        revenue: 6800,
      },
    ],

    // Expense Breakdown
    expenseBreakdown: [
      { category: "Supplies", amount: 22100, percentage: 35 },
      { category: "Lab Fees", amount: 18500, percentage: 30 },
      { category: "Rent", amount: 12700, percentage: 20 },
      { category: "Marketing", amount: 6200, percentage: 10 },
      { category: "Other", amount: 2800, percentage: 5 },
    ],

    // AI Insights
    aiInsights: [
      {
        type: "warning" as const,
        title: "Overdue Insurance Claims",
        message:
          "$12,400 in claims are 60+ days overdue. Consider following up with Sun Life and Blue Cross.",
      },
      {
        type: "suggestion" as const,
        title: "Revenue Opportunity",
        message:
          "Cosmetic treatments dropped 10% this quarter — consider promotions or marketing campaigns.",
      },
      {
        type: "alert" as const,
        title: "Chair Utilization Alert",
        message:
          "Chair 2 in Location B underutilized — only 42% booked last month.",
      },
      {
        type: "warning" as const,
        title: "Expense Anomaly",
        message:
          "Lab costs are 18% above average — check vendor invoices for discrepancies.",
      },
    ],
  };
};

const Dashboardpage = () => {
  const data = useDashboardData();
  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("dashboard-card-order");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn("Failed to load card order from localStorage", error);
    }
    return [
      "total-collections",
      "outstanding-receivables",
      "cash-on-hand",
      "expense-summary",
      "profitability",
    ];
  });
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    try {
      localStorage.setItem("dashboard-card-order", JSON.stringify(cardOrder));
    } catch (error) {
      console.warn("Failed to save card order to localStorage", error);
    }
  }, [cardOrder]);

  const handleDragStart = (cardId: string) => {
    setDraggedCardId(cardId);
  };

  const handleDragEnd = () => {
    if (draggedCardId !== null && dragOverIndex !== null) {
      const currentIndex = cardOrder.indexOf(draggedCardId);
      if (currentIndex !== -1 && currentIndex !== dragOverIndex) {
        const newOrder = [...cardOrder];
        const [removed] = newOrder.splice(currentIndex, 1);
        newOrder.splice(dragOverIndex, 0, removed);
        setCardOrder(newOrder);
      }
    }
    setDraggedCardId(null);
    setDragOverIndex(null);
  };

  useEffect(() => {
    if (!draggedCardId || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      // Find which card position the mouse is over
      let newIndex = cardOrder.length;
      for (let i = 0; i < cardOrder.length; i++) {
        const cardId = cardOrder[i];
        if (cardId === draggedCardId) continue;

        const cardElement = cardRefs.current.get(cardId);
        if (!cardElement) continue;

        const cardRect = cardElement.getBoundingClientRect();
        const relativeX = cardRect.left - containerRect.left;
        const relativeY = cardRect.top - containerRect.top;

        // Check if mouse is over this card
        if (
          mouseX >= relativeX &&
          mouseX <= relativeX + cardRect.width &&
          mouseY >= relativeY &&
          mouseY <= relativeY + cardRect.height
        ) {
          // Determine if we should insert before or after
          const cardCenterX = relativeX + cardRect.width / 2;
          const cardCenterY = relativeY + cardRect.height / 2;

          if (mouseX < cardCenterX || mouseY < cardCenterY) {
            newIndex = i;
          } else {
            newIndex = i + 1;
          }
          break;
        }

        // If mouse is before this card
        if (
          mouseY < relativeY ||
          (mouseY < relativeY + cardRect.height && mouseX < relativeX)
        ) {
          newIndex = i;
          break;
        }
      }

      setDragOverIndex(newIndex);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [draggedCardId, cardOrder]);

  const cardConfigs = [
    {
      id: "total-collections",
      title: "Total Collections",
      value: data.totalCollections.value,
      trend: data.totalCollections.trend,
      breakdown: data.totalCollections.breakdown,
      aiNotes: data.totalCollections.aiNotes,
      icon: <FaMoneyBillWave />,
    },
    {
      id: "outstanding-receivables",
      title: "Outstanding Receivables",
      value: data.outstandingReceivables.value,
      breakdown: data.outstandingReceivables.breakdown,
      aiNotes: data.outstandingReceivables.aiNotes,
      icon: <FaFileInvoiceDollar />,
    },
    {
      id: "cash-on-hand",
      title: "Cash on Hand",
      value: data.cashOnHand.value,
      indicator: data.cashOnHand.indicator,
      aiNotes: data.cashOnHand.aiNotes,
      icon: <FaPiggyBank />,
    },
    {
      id: "expense-summary",
      title: "Expense Summary",
      value: data.expenseSummary.value,
      trend: data.expenseSummary.trend,
      breakdown: data.expenseSummary.breakdown,
      aiNotes: data.expenseSummary.aiNotes,
      icon: <FaChartLine />,
    },
    {
      id: "profitability",
      title: "Profitability",
      value: data.profitability.value,
      trend: data.profitability.trend,
      icon: <FaArrowTrendUp />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards Section - Top */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">Key Metrics</h2>
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 relative"
        >
          {cardOrder.map((cardId, index) => {
            const config = cardConfigs.find((c) => c.id === cardId);
            if (!config) return null;

            const isDragging = draggedCardId === cardId;
            const showDropIndicator =
              dragOverIndex === index && draggedCardId !== null && !isDragging;

            return (
              <div
                key={cardId}
                ref={(el) => {
                  if (el) {
                    cardRefs.current.set(cardId, el);
                  } else {
                    cardRefs.current.delete(cardId);
                  }
                }}
                className="relative w-full sm:w-auto"
                style={{
                  order: isDragging ? 999 : index,
                }}
              >
                {showDropIndicator && (
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded z-40"></div>
                )}
                <ResizableCard
                  id={cardId}
                  defaultWidth={320}
                  defaultHeight={320}
                  isDragging={isDragging}
                  onDragStart={() => handleDragStart(cardId)}
                  onDragEnd={handleDragEnd}
                >
                  <SummaryCard
                    title={config.title}
                    value={config.value}
                    trend={config.trend}
                    breakdown={config.breakdown}
                    aiNotes={config.aiNotes}
                    indicator={config.indicator}
                    icon={config.icon}
                  />
                </ResizableCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section - Main Visualizations */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">
          Analytics & Reports
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue by Procedure Type */}
            <ChartWidget
              title="Revenue by Procedure Type"
              subtitle="This month's revenue breakdown"
              aiInsight="Cosmetic treatments dropped 10% this quarter — consider promotions."
            >
              <RevenueBarChart data={data.revenueByProcedure} />
            </ChartWidget>

            {/* Insurance Performance Tracker */}
            <ChartWidget
              title="Insurance Performance Tracker"
              subtitle="Top 5 insurance providers by claim volume"
              aiInsight="Claims from Sun Life average 52 days — slower than usual."
            >
              <InsuranceChart data={data.insurancePerformance} />
            </ChartWidget>

            {/* Two Column Grid for Smaller Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dentist Productivity */}
              <ChartWidget
                title="Dentist Productivity"
                subtitle="Revenue and procedures per dentist"
              >
                <div className="space-y-4">
                  {data.dentistProductivity.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="border-l-4 border-primary pl-4"
                    >
                      <div className="font-semibold text-primary mb-1">
                        {item.name}
                      </div>
                      <div className="text-sm text-primary-75">
                        ${item.revenue.toLocaleString()} revenue
                      </div>
                      <div className="text-xs text-primary-50">
                        {item.procedures} procedures
                      </div>
                    </div>
                  ))}
                </div>
              </ChartWidget>

              {/* Chair Utilization */}
              <ChartWidget
                title="Chair Utilization"
                subtitle="% of available hours used"
                aiInsight="Chair 2 in Location B underutilized — only 42% booked last month."
              >
                <ChairUtilizationChart data={data.chairUtilization} />
              </ChartWidget>
            </div>

            {/* Expense Breakdown */}
            <ChartWidget
              title="Expense Breakdown"
              subtitle="This month's expenses by category"
              aiInsight="Supply costs 12% higher than regional benchmark for similar practices."
              actions={
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 bg-primary-10 text-primary rounded hover:bg-primary-25">
                    This Month
                  </button>
                  <button className="text-xs px-2 py-1 text-primary-50 rounded hover:bg-primary-10">
                    YTD
                  </button>
                </div>
              }
            >
              <ExpensePieChart data={data.expenseBreakdown} />
            </ChartWidget>

            {/* Profitability Trend */}
            <ChartWidget
              title="Profitability Trend"
              subtitle="Net profit margin over the last 5 months"
              aiInsight="Profitability is trending upward and exceeding target."
            >
              <ProfitabilityLineChart data={data.profitability.chartData} />
            </ChartWidget>
          </div>

          {/* Right Column - AI Insights */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2 shadow-sm border border-primary-10 p-6 sticky top-0">
              <div className="flex items-center gap-2 mb-4">
                <FaExclamationTriangle className="text-primary" />
                <h3 className="text-lg font-semibold text-primary">
                  AI Insights & Actions
                </h3>
              </div>
              <div className="space-y-4">
                {data.aiInsights.map((insight, index) => (
                  <AIInsightCard
                    key={`insight-${index}`}
                    type={insight.type}
                    title={insight.title}
                    message={insight.message}
                    onAccept={() => console.log("Accepted", index)}
                    onSnooze={() => console.log("Snoozed", index)}
                    onDismiss={() => console.log("Dismissed", index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardpage;
