export default function MenuPublicLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 60 }}>
      {/* 1. Header Cover Skeleton */}
      <div style={{ position: 'relative', width: '100%', height: '220px', background: '#e2e8f0', overflow: 'hidden' }} className="skeleton">
        {/* Floating elements inside loading cover */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 20px',
            maxWidth: '640px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '16px',
            zIndex: 10,
          }}
        >
          {/* Logo floating skeleton */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: '#cbd5e1',
              border: '4px solid #ffffff',
              flexShrink: 0,
            }}
          />

          {/* Info Details skeleton */}
          <div style={{ flex: 1 }}>
            {/* Status badge skeleton */}
            <div
              style={{
                width: '90px',
                height: '16px',
                background: '#cbd5e1',
                borderRadius: '999px',
                marginBottom: '8px',
              }}
            />
            {/* Name skeleton */}
            <div
              style={{
                width: '180px',
                height: '24px',
                background: '#cbd5e1',
                borderRadius: '6px',
                marginBottom: '8px',
              }}
            />
            {/* Address skeleton */}
            <div
              style={{
                width: '120px',
                height: '14px',
                background: '#cbd5e1',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Sticky Navigation Skeletons */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 16px 8px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {/* Search bar skeleton */}
          <div
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '14px',
              background: '#e2e8f0',
              marginBottom: '12px',
            }}
            className="skeleton"
          />

          {/* Category tabs skeleton */}
          <div style={{ display: 'flex', gap: '8px', overflow: 'hidden' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: i === 1 ? '90px' : i === 2 ? '75px' : i === 3 ? '100px' : '65px',
                  height: '32px',
                  borderRadius: '999px',
                  background: '#e2e8f0',
                  flexShrink: 0,
                }}
                className="skeleton"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Menu Grid / Cards Skeletons */}
      <div style={{ maxWidth: '640px', margin: '20px auto 0', padding: '0 16px' }}>
        {/* Category Header skeleton */}
        <div
          style={{
            width: '140px',
            height: '20px',
            background: '#e2e8f0',
            borderRadius: '6px',
            marginBottom: '16px',
          }}
          className="skeleton"
        />

        {/* 4 Cards Skeleton Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'row',
                height: '115px',
              }}
            >
              {/* Image skeleton */}
              <div
                style={{
                  width: '115px',
                  height: '100%',
                  background: '#e2e8f0',
                  flexShrink: 0,
                }}
                className="skeleton"
              />

              {/* Content text skeleton */}
              <div
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Name skeleton */}
                  <div
                    style={{
                      width: '50%',
                      height: '14px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                    className="skeleton"
                  />
                  {/* Description skeleton */}
                  <div
                    style={{
                      width: '85%',
                      height: '11px',
                      background: '#f1f5f9',
                      borderRadius: '3px',
                      marginBottom: '5px',
                    }}
                    className="skeleton"
                  />
                  <div
                    style={{
                      width: '60%',
                      height: '11px',
                      background: '#f1f5f9',
                      borderRadius: '3px',
                    }}
                    className="skeleton"
                  />
                </div>

                {/* Price skeleton */}
                <div
                  style={{
                    width: '65px',
                    height: '16px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                  }}
                  className="skeleton"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
