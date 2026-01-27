package camping.campbackoffice.dtos;

import java.util.Map;

// RevenueStatsDTO.java
public class RevenueStatsDTO {
    private String period;
    private Double totalRevenue;
    private Map<String, Double> revenueData; // Date/Revenue

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Map<String, Double> getRevenueData() {
        return revenueData;
    }

    public void setRevenueData(Map<String, Double> revenueData) {
        this.revenueData = revenueData;
    }
// Getters/Setters
}