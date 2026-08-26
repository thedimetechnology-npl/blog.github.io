/**
 * Blog Filter with Dynamic Category Counts
 */

(function() {
  "use strict";

  // Initialize filter counts and listeners when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogFilter);
  } else {
    initBlogFilter();
  }

  function initBlogFilter() {
    const filterContainers = document.querySelectorAll('.blog-filter');
    const blogPostItems = document.querySelectorAll('.blog-post-item');
    const noResultsDiv = document.getElementById('no-results');
    const resetButton = document.getElementById('resetFilters');

    // Initialize counts for all filters
    updateAllCounts();

    // Add event listeners to all filter links
    filterContainers.forEach(container => {
      const filterType = container.getAttribute('data-filter');
      const filterLinks = container.querySelectorAll('a');

      filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          const filterValue = this.getAttribute('data-value');
          
          // Update active state
          filterLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');

          // Apply filter
          applyFilters();
        });
      });
    });

    // Reset button handler
    if (resetButton) {
      resetButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Reset all filters to "all"
        filterContainers.forEach(container => {
          const allLink = container.querySelector('a[data-value="all"]');
          if (allLink) {
            container.querySelectorAll('a').forEach(l => l.classList.remove('active'));
            allLink.classList.add('active');
          }
        });

        // Show all posts
        applyFilters();
      });
    }

    function applyFilters() {
      let visibleCount = 0;

      // Get active filters
      const activeFilters = {};
      filterContainers.forEach(container => {
        const filterType = container.getAttribute('data-filter');
        const activeLink = container.querySelector('a.active');
        if (activeLink) {
          const value = activeLink.getAttribute('data-value');
          if (value !== 'all') {
            activeFilters[filterType] = value;
          }
        }
      });

      // Filter posts
      blogPostItems.forEach(post => {
        let show = true;

        // Check all active filters
        Object.keys(activeFilters).forEach(filterType => {
          const filterValue = activeFilters[filterType];
          const postAttr = post.getAttribute(`data-${filterType}`);
          
          if (postAttr !== filterValue) {
            show = false;
          }
        });

        if (show) {
          post.style.display = 'block';
          visibleCount++;
        } else {
          post.style.display = 'none';
        }
      });

      // Show/hide no results message
      if (noResultsDiv) {
        noResultsDiv.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      // Update counts after filtering
      updateAllCounts();
    }

    function updateAllCounts() {
      filterContainers.forEach(container => {
        const filterType = container.getAttribute('data-filter');
        const filterLinks = container.querySelectorAll('a');

        filterLinks.forEach(link => {
          const filterValue = link.getAttribute('data-value');
          let count = 0;

          if (filterValue === 'all') {
            // Count all visible posts
            blogPostItems.forEach(post => {
              if (post.style.display !== 'none') {
                count++;
              }
            });
          } else {
            // Count posts matching this specific filter
            blogPostItems.forEach(post => {
              const postAttr = post.getAttribute(`data-${filterType}`);
              if (postAttr === filterValue && post.style.display !== 'none') {
                count++;
              }
            });
          }

          // Update the link text with count
          const linkText = link.textContent.trim();
          const baseText = linkText.split('(')[0].trim();
          link.innerHTML = baseText + ' <span class="filter-count">(' + count + ')</span>';
        });
      });
    }
  }
})();