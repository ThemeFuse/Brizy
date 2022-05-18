import { StringDate } from "visual/utils/date/StringDate";
import { Item } from "../../AjaxApi/Cart";
import { Product, ProductHandle, ProductId } from "../../types/Product";
import { CartApi, ProductApi } from "./Api";
import { SKU, VariationId } from "../../types/Variation";
import { Price } from "../../types/Price";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

export class CartApiMock implements CartApi {
  private items: Item[] = [];

  add(items: Item[]): Promise<Item[]> {
    const ids = this.items.map(i => i.id);
    const newItems = items.filter(i => !ids.includes(i.id));

    this.items = [
      ...this.items.map(i => {
        const item = items.find(t => t.id === i.id);

        return item ? { ...i, quantity: i.quantity + item.quantity } : i;
      }),
      ...newItems
    ];

    return of(this.items)
      .pipe(delay(200))
      .toPromise();
  }
}

export class ProductApiMock implements ProductApi {
  private product: Product = {
    id: 7076768645314 as ProductId,
    title: "841851",
    handle: "841851" as ProductHandle,
    description:
      "\u003cmeta charset=\"utf-8\"\u003e\n\u003cdiv\u003e\n\u003cp\u003e\u003cstrong\u003eLorem Ipsum\u003c/strong\u003e\u003cspan\u003e\u00a0\u003c/span\u003eis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\u003c/p\u003e\n\u003c/div\u003e\n\u003cdiv\u003e\n\u003ch2\u003eWhy do we use it?\u003c/h2\u003e\n\u003cp\u003eIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\u003c/p\u003e\n\u003c/div\u003e",
    published_at: "2021-10-21T10:53:51+03:00" as StringDate,
    created_at: "2021-10-21T10:51:25+03:00" as StringDate,
    vendor: "brizy12",
    type: "",
    tags: [],
    price: 0,
    price_min: 0,
    price_max: 0,
    available: true,
    price_varies: false,
    compare_at_price: null,
    compare_at_price_min: 0,
    compare_at_price_max: 0,
    compare_at_price_varies: false,
    variants: [
      {
        id: 41476847501506 as VariationId,
        title: "S",
        option1: "S",
        option2: null,
        option3: null,
        sku: "" as SKU,
        requires_shipping: true,
        taxable: true,
        featured_image: {
          id: 31801540509890,
          product_id: 7076768645314 as ProductId,
          position: 2,
          created_at: "2022-01-12T13:47:36+02:00" as StringDate,
          updated_at: "2022-01-12T13:47:38+02:00" as StringDate,
          alt: null,
          width: 1950,
          height: 1300,
          src:
            "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1532982116380-02ce47a3e03c.jpg?v=1641988058",
          variant_ids: [41476847501506 as VariationId]
        },
        available: true,
        options: ["S"],
        price: 0 as Price,
        weight: 0,
        compare_at_price: null,
        inventory_management: "shopify",
        barcode: "",
        featured_media: {
          alt: null,
          id: 24123763163330,
          position: 2,
          preview_image: {
            aspect_ratio: 1.5,
            height: 1300,
            width: 1950,
            src:
              "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1532982116380-02ce47a3e03c.jpg?v=1641988058"
          }
        }
      },
      {
        id: 41476847534274 as VariationId,
        title: "M",
        option1: "M",
        option2: null,
        option3: null,
        sku: "" as SKU,
        requires_shipping: true,
        taxable: true,
        featured_image: {
          id: 31801540608194,
          product_id: 7076768645314 as ProductId,
          position: 3,
          created_at: "2022-01-12T13:47:36+02:00" as StringDate,
          updated_at: "2022-01-12T13:47:38+02:00" as StringDate,
          alt: null,
          width: 1951,
          height: 1301,
          src:
            "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533079047304-3997643590ab.jpg?v=1641988058",
          variant_ids: [41476847534274 as VariationId]
        },
        available: false,
        options: ["M"],
        price: 0 as Price,
        weight: 0,
        compare_at_price: null,
        inventory_management: "shopify",
        barcode: "",
        featured_media: {
          alt: null,
          id: 24123763196098,
          position: 3,
          preview_image: {
            aspect_ratio: 1.5,
            height: 1301,
            width: 1951,
            src:
              "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533079047304-3997643590ab.jpg?v=1641988058"
          }
        }
      },
      {
        id: 41476847567042 as VariationId,
        title: "L",
        option1: "L",
        option2: null,
        option3: null,
        sku: "" as SKU,
        requires_shipping: true,
        taxable: true,
        featured_image: {
          id: 31801540542658,
          product_id: 7076768645314 as ProductId,
          position: 5,
          created_at: "2022-01-12T13:47:36+02:00" as StringDate,
          updated_at: "2022-01-12T13:47:38+02:00" as StringDate,
          alt: null,
          width: 1950,
          height: 1300,
          src:
            "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533227356842-2b94d2d24d8d.jpg?v=1641988058",
          variant_ids: [41476847567042 as VariationId]
        },
        available: false,
        options: ["L"],
        price: 0 as Price,
        weight: 0,
        compare_at_price: null,
        inventory_management: "shopify",
        barcode: "",
        featured_media: {
          alt: null,
          id: 24123763261634,
          position: 5,
          preview_image: {
            aspect_ratio: 1.5,
            height: 1300,
            width: 1950,
            src:
              "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533227356842-2b94d2d24d8d.jpg?v=1641988058"
          }
        }
      }
    ],
    images: [
      "//cdn.shopify.com/s/files/1/0573/9649/4530/products/car_27480qb9z4484phaxdq99tgdxbev.jpg?v=1641801607",
      "//cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1532982116380-02ce47a3e03c.jpg?v=1641988058",
      "//cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533079047304-3997643590ab.jpg?v=1641988058",
      "//cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533139143976-30918502365b.jpg?v=1641988058",
      "//cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533227356842-2b94d2d24d8d.jpg?v=1641988058"
    ],
    featured_image:
      "//cdn.shopify.com/s/files/1/0573/9649/4530/products/car_27480qb9z4484phaxdq99tgdxbev.jpg?v=1641801607",
    options: [{ name: "Size", position: 1, values: ["S", "M", "L"] }],
    url: "/products/841851",
    media: [
      {
        alt: null,
        id: 24095807963330,
        position: 1,
        preview_image: {
          aspect_ratio: 1.333,
          height: 600,
          width: 800,
          src:
            "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/car_27480qb9z4484phaxdq99tgdxbev.jpg?v=1641801607"
        },
        aspect_ratio: 1.333,
        height: 600,
        media_type: "image",
        src:
          "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/car_27480qb9z4484phaxdq99tgdxbev.jpg?v=1641801607",
        width: 800
      },
      {
        alt: null,
        id: 24123763163330,
        position: 2,
        preview_image: {
          aspect_ratio: 1.5,
          height: 1300,
          width: 1950,
          src:
            "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1532982116380-02ce47a3e03c.jpg?v=1641988058"
        },
        aspect_ratio: 1.5,
        height: 1300,
        media_type: "image",
        src:
          "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1532982116380-02ce47a3e03c.jpg?v=1641988058",
        width: 1950
      },
      {
        alt: null,
        id: 24123763196098,
        position: 3,
        preview_image: {
          aspect_ratio: 1.5,
          height: 1301,
          width: 1951,
          src:
            "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533079047304-3997643590ab.jpg?v=1641988058"
        },
        aspect_ratio: 1.5,
        height: 1301,
        media_type: "image",
        src:
          "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533079047304-3997643590ab.jpg?v=1641988058",
        width: 1951
      },
      {
        alt: null,
        id: 24123763228866,
        position: 4,
        preview_image: {
          aspect_ratio: 1.5,
          height: 1300,
          width: 1950,
          src:
            "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533139143976-30918502365b.jpg?v=1641988058"
        },
        aspect_ratio: 1.5,
        height: 1300,
        media_type: "image",
        src:
          "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533139143976-30918502365b.jpg?v=1641988058",
        width: 1950
      },
      {
        alt: null,
        id: 24123763261634,
        position: 5,
        preview_image: {
          aspect_ratio: 1.5,
          height: 1300,
          width: 1950,
          src:
            "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533227356842-2b94d2d24d8d.jpg?v=1641988058"
        },
        aspect_ratio: 1.5,
        height: 1300,
        media_type: "image",
        src:
          "https://cdn.shopify.com/s/files/1/0573/9649/4530/products/photo-1533227356842-2b94d2d24d8d.jpg?v=1641988058",
        width: 1950
      }
    ]
  };

  get(_handle: ProductHandle): Promise<Product> {
    return of(this.product)
      .pipe(delay(2000))
      .toPromise();
  }
}
