package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.function.BiConsumer;

@Service
public class SpreadsheetGenerationService {

    private final OrderRepository orderRepository;


    public String[] HEADERS = {
        "Reference Number", "Customer Email", "Router", "Preset",
        "Primary Outside Connection", "Secondary Outside Connection",
        "Inside Connections", "VLAN Type", "DHCP",
        "Number of Routers", "Site Name", "Address", "Postcode",
        "Primary Email", "Secondary Email", "Phone Number",
        "Contact Name", "Priority Level", "Status",
        "Additional Information", "Order Date"
    };

    public SpreadsheetGenerationService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    public List<String> getDistinctCustomers(){
        return orderRepository.findDistinctBySitePrimaryEmail();

    }

    public void write(File file, boolean separateSheets){
        try(Workbook wb = new XSSFWorkbook()){
            writeOrders(orderRepository.findAll(), wb);
            if(separateSheets){
                writeOrdersByCustomer(getDistinctCustomers(), wb);
            }

            try (FileOutputStream fos = new FileOutputStream(file)){
                wb.write(fos);
            }
        } catch (IOException e){
            throw new RuntimeException(e);
        }
    }

    private void writeOrders(List<Order> orders, Workbook wb) {
        Sheet sheet = wb.createSheet("Full orders");
        createHeaderRow(sheet);

        int rowNum = 1;

        for (Order order : orders) {
            Row row = sheet.createRow(rowNum++);
            populateRows(row, order);
        }

        for (int i = 0; i < HEADERS.length; i++) {
            sheet.autoSizeColumn(i);
        }

    }

    private void writeOrdersByCustomer(List<String> distinctCustomers, Workbook wb) {
        for (String customerEmail : distinctCustomers) {
            Sheet sheet = wb.createSheet(customerEmail);
            createHeaderRow(sheet);
            int rowNum = 1;
            List<Order> customerOrders = orderRepository.findOrdersByEmail(customerEmail);
            for (Order order : customerOrders) {
                Row row = sheet.createRow(rowNum++);
                populateRows(row, order);
            }
            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }
        }

    }

    private void populateRows(Row row, Order order) {

        BiConsumer<Cell, Integer> setNumericCell = (cell, value) -> {
            if (value != null) cell.setCellValue(value.doubleValue());
        };

        int colNum = 0;
        row.createCell(colNum++).setCellValue(order.getReferenceNumber());
        row.createCell(colNum++).setCellValue(order.getEmail());
        row.createCell(colNum++).setCellValue(order.getRouter().getRouterName());
        row.createCell(colNum++).setCellValue(order.getRouterPreset() != null ? order.getRouterPreset().getRouterPresetName() : "None");
        row.createCell(colNum++).setCellValue(order.getPrimaryOutsideConnections());
        row.createCell(colNum++).setCellValue(order.getSecondaryOutsideConnections());
        row.createCell(colNum++).setCellValue(order.getInsideConnections());
        row.createCell(colNum++).setCellValue(order.getVlans().toString());
        row.createCell(colNum++).setCellValue(order.getDhcp() != null && order.getDhcp() ? "Yes" : "No");
        row.createCell(colNum++).setCellValue(order.getNumRouters());
        row.createCell(colNum++).setCellValue(order.getSiteName());
        row.createCell(colNum++).setCellValue(order.getAddress());
        row.createCell(colNum++).setCellValue(order.getPostcode());
        row.createCell(colNum++).setCellValue(order.getSitePrimaryEmail());
        row.createCell(colNum++).setCellValue(order.getSiteSecondaryEmail());
        row.createCell(colNum++).setCellValue(order.getSitePhoneNumber());
        row.createCell(colNum++).setCellValue(order.getSiteContactName());
        row.createCell(colNum++).setCellValue(order.getPriorityLevel());
        row.createCell(colNum++).setCellValue(order.getStatus());
        row.createCell(colNum++).setCellValue(order.getAdditionalInformation());
        row.createCell(colNum++).setCellValue(order.getOrderDate().toString());
    }

    private void createHeaderRow(Sheet sheet) {
        Row row = sheet.createRow(0);
        CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
        Font headerFont = sheet.getWorkbook().createFont();
        headerFont.setBold(true);
        headerFont.setFontName("Roboto");

        IndexedColors headerColor = IndexedColors.GREY_40_PERCENT;
        XSSFColor xssfColor = new XSSFColor(headerColor, null);
        headerStyle.setFillBackgroundColor(xssfColor);
        headerStyle.setFont(headerFont);

        for (int i = 0; i < HEADERS.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(HEADERS[i]);
            cell.setCellStyle(headerStyle);
        }
    }
}
