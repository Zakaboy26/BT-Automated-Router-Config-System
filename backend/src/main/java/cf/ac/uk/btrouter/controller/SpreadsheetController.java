package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.service.SpreadsheetGenerationService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/spreadsheet")
public class SpreadsheetController {

    private final SpreadsheetGenerationService spreadsheetService;

    public SpreadsheetController(SpreadsheetGenerationService spreadsheetService) {
        this.spreadsheetService = spreadsheetService;
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadSpreadsheet(@RequestParam(name = "separateSheets", required = false) String separateCustomers) {
        File file = new File("orders.xlsx");
        boolean isSeparate = Boolean.parseBoolean(separateCustomers);
        spreadsheetService.write(file, isSeparate);

        try {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=orders.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

}

