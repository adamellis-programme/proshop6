import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  console.log(pages)
  return (
    // if only one page do not show
    // map through the pages - have an array, pass in pages starts at 0
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            // + 1 = 0 based so start at 1
            // link depending on if admin or not
            /**
             * NEED THIS AS IT CHANGES THE PARAMS
             * AND THEREFOR SHOWS DIFFERENT DATA
             * ON THE HOME SCREEN PAGE
             *
             * IF NOT ADMIN GO TO  `/admin/productlist/${x + 1}`
             *
             * The ternary operator (? :) is used to decide between two different URL formats based on whether the user is an admin or not.
             *
             * if not an admin (!isAdmin): The URL path is determined based on the presence of a keyword.
             *
             * if an admin (isAdmin): The URL path is directed to an admin-specific page.
             *
             * keyword ? ... : ...: The keyword variable likely represents a search term entered by the user.
             * It’s used to determine if the user is navigating through a search results page.
             * The last condition will be evaluated if isAdmin is passed as a prop of true.
             *
             * If keyword use keyword and pagination
             * if no key word use just pagination
             * else if isAdmin use admin route
             *
             */

            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
          >
            {/* page pag item
                if x + 1 === page this will
                be our acitve link
                */}
            {/* The active={x + 1 === page} prop ensures that the current page number (stored in the page variable) is highlighted or styled differently to indicate that it is the active page. */}
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  )
}

export default Paginate

// same as saying this

// const getPageLink = () => {
//   if (!isAdmin) {
//     return keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`
//   }
//   return `/admin/productlist/${x + 1}`
// }

// Then use that as the prop:

// to={getPageLink()}
