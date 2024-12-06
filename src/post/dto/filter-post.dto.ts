export class FilterPostDto {
    // số trang
    page: string;
    // số item trong 1 trang
    items_per_page: string;
    // tìm theo từ khoá
    search: string;
    // phân loại theo category
    category: string;
}
